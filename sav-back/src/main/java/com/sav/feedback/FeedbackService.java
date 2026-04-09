package com.sav.feedback;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.sav.common.dto.*;
import com.sav.common.enums.TicketStatut;
import com.sav.sms.TwilioService;
import com.sav.ticket.TicketEntity;
import com.sav.ticket.TicketRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final FeedbackRepository    feedbackRepository;
    private final FeedbackOtpRepository feedbackOtpRepository;
    private final TicketRepository      ticketRepository;
    private final TwilioService         twilioService;
    private final PasswordEncoder       passwordEncoder;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${app.feedback.token-validity-days:30}")
    private int tokenValidityDays;

    @Value("${app.feedback.otp-validity-minutes:5}")
    private int otpValidityMinutes;

    @Value("${app.feedback.otp-max-attempts:3}")
    private int maxAttempts;

    @Value("${app.feedback.otp-access-token-validity-minutes:15}")
    private int accessTokenValidityMinutes;

    // ─── QR Code (authentifié — staff uniquement) ─────────────────────────────

    /**
     * Génère (ou régénère si expiré) le QR Code d'un ticket.
     * Appelé depuis TicketController — réservé au staff authentifié.
     */
    @Transactional
    public QrCodeResponse generateQrCode(Long ticketId) {
        TicketEntity ticket = ticketRepository.findByIdWithRelations(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket non trouvé : " + ticketId));

        if (ticket.getQrToken() == null || isQrTokenExpired(ticket)) {
            ticket.setQrToken(UUID.randomUUID().toString());
            ticket.setQrTokenExpiresAt(LocalDateTime.now().plusDays(tokenValidityDays));
            ticketRepository.save(ticket);
        }

        String url = frontendUrl + "/feedback?token=" + ticket.getQrToken();
        return new QrCodeResponse(encodeQrToBase64(url), ticket.getQrTokenExpiresAt());
    }

    // ─── Étape 1 — Initiation OTP (endpoint public GET) ──────────────────────

    /**
     * Valide le token QR, génère un OTP 6 chiffres, l'envoie par SMS.
     * Retourne le numéro masqué et un message informatif.
     * Si le feedback a déjà été soumis, retourne {@code alreadySubmitted=true} sans envoyer de SMS.
     */
    @Transactional
    public OtpInitiateResponse initiateOtp(String token) {
        TicketEntity ticket = resolveValidTicket(token);

        // Cas : feedback déjà soumis → pas d'OTP
        if (ticket.isFeedbackSoumis()) {
            return new OtpInitiateResponse(true, null, null);
        }

        // Invalider tout OTP actif précédent pour ce token QR
        feedbackOtpRepository.findTopByQrTokenAndUsedFalseOrderByCreatedAtDesc(token)
                .ifPresent(existing -> {
                    existing.setUsed(true);
                    feedbackOtpRepository.save(existing);
                });

        // Générer OTP 6 chiffres, haché en BCrypt
        String otp       = generateOtp();
        String hashedOtp = passwordEncoder.encode(otp);

        FeedbackOtpEntity otpEntity = FeedbackOtpEntity.builder()
                .qrToken(token)
                .hashedOtp(hashedOtp)
                .expiresAt(LocalDateTime.now().plusMinutes(otpValidityMinutes))
                .build();
        feedbackOtpRepository.save(otpEntity);

        // Récupérer et masquer le téléphone du client
        String phone       = ticket.getClient().getTelephone();
        String maskedPhone = maskPhone(phone);

        // Envoyer le SMS
        twilioService.sendOtp(phone, otp);

        return new OtpInitiateResponse(
                false,
                maskedPhone,
                "Un code de vérification a été envoyé par SMS au " + maskedPhone + "."
        );
    }

    // ─── Étape 2 — Vérification OTP (endpoint public POST /verify-otp) ────────

    /**
     * Vérifie le code OTP saisi par le client.
     * En cas de succès, génère un accessToken de session (15 min) et retourne les données du formulaire.
     * Incrémente le compteur de tentatives à chaque échec.
     * Bloque définitivement après {@code maxAttempts} tentatives incorrectes.
     */
    @Transactional
    public OtpVerifyResponse verifyOtp(String token, String otp) {
        FeedbackOtpEntity otpEntity = feedbackOtpRepository
                .findTopByQrTokenAndUsedFalseOrderByCreatedAtDesc(token)
                .orElseThrow(() -> new IllegalStateException(
                        "Code invalide ou expiré. Veuillez rescanner le QR Code pour obtenir un nouveau code."));

        // Vérification de l'expiration
        if (LocalDateTime.now().isAfter(otpEntity.getExpiresAt())) {
            otpEntity.setUsed(true);
            feedbackOtpRepository.save(otpEntity);
            throw new IllegalStateException(
                    "Le code OTP a expiré. Veuillez rescanner le QR Code pour en obtenir un nouveau.");
        }

        // Vérification du nombre de tentatives
        if (otpEntity.getAttempts() >= maxAttempts) {
            otpEntity.setUsed(true);
            feedbackOtpRepository.save(otpEntity);
            throw new IllegalStateException(
                    "Trop de tentatives incorrectes. Veuillez rescanner le QR Code.");
        }

        // Vérification du code OTP (BCrypt)
        if (!passwordEncoder.matches(otp, otpEntity.getHashedOtp())) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            feedbackOtpRepository.save(otpEntity);
            int remaining = maxAttempts - otpEntity.getAttempts();
            if (remaining <= 0) {
                otpEntity.setUsed(true);
                feedbackOtpRepository.save(otpEntity);
                throw new IllegalStateException(
                        "Code incorrect. Trop de tentatives. Veuillez rescanner le QR Code.");
            }
            throw new IllegalStateException(
                    "Code incorrect. " + remaining + " tentative(s) restante(s).");
        }

        // OTP valide → générer le token de session
        String accessToken = UUID.randomUUID().toString();
        otpEntity.setUsed(true);
        otpEntity.setVerifiedToken(accessToken);
        otpEntity.setVerifiedTokenExpiresAt(LocalDateTime.now().plusMinutes(accessTokenValidityMinutes));
        feedbackOtpRepository.save(otpEntity);

        // Récupérer les données du formulaire
        TicketEntity ticket = resolveValidTicket(token);
        FeedbackFormDataResponse formData = buildFormData(ticket);

        log.info("OTP vérifié avec succès pour le ticket {}", ticket.getNumero());
        return new OtpVerifyResponse(accessToken, formData);
    }

    // ─── Étape 3 — Soumission du feedback (endpoint public POST /submit) ───────

    /**
     * Valide le token de session, persiste le feedback et clôture le ticket.
     * Le token de session est invalidé après usage (one-shot).
     */
    @Transactional
    public void submitFeedback(FeedbackRequest request) {
        // Valider le token de session
        FeedbackOtpEntity otpEntity = feedbackOtpRepository
                .findByVerifiedToken(request.accessToken())
                .orElseThrow(() -> new IllegalStateException(
                        "Session de feedback invalide ou expirée. Veuillez rescanner le QR Code."));

        if (otpEntity.getVerifiedTokenExpiresAt() == null
                || LocalDateTime.now().isAfter(otpEntity.getVerifiedTokenExpiresAt())) {
            throw new IllegalStateException(
                    "Votre session a expiré (15 min). Veuillez rescanner le QR Code.");
        }

        TicketEntity ticket = resolveValidTicket(otpEntity.getQrToken());

        if (ticket.isFeedbackSoumis()) {
            throw new IllegalStateException("Ce feedback a déjà été soumis pour ce ticket.");
        }

        // Persister le feedback
        FeedbackEntity feedback = FeedbackEntity.builder()
                .ticket(ticket)
                .noteTechnicien(request.noteTechnicien())
                .commentaireTechnicien(request.commentaireTechnicien())
                .noteEntreprise(request.noteEntreprise())
                .commentaireEntreprise(request.commentaireEntreprise())
                .build();
        feedbackRepository.save(feedback);

        // Marquer le ticket comme évalué
        ticket.setFeedbackSoumis(true);
        if (ticket.getStatut() == TicketStatut.TERMINE) {
            ticket.setStatut(TicketStatut.CLOTURE);
        }
        ticketRepository.save(ticket);

        // Invalider le token de session (one-shot)
        otpEntity.setVerifiedToken(null);
        feedbackOtpRepository.save(otpEntity);

        log.info("Feedback soumis pour le ticket {} — technicien: {}/5, entreprise: {}/5",
                ticket.getNumero(), request.noteTechnicien(), request.noteEntreprise());
    }

    // ─── Helpers privés ───────────────────────────────────────────────────────

    /**
     * Retrouve et valide un ticket par son token QR (non expiré).
     * Charge client/technicien/site en un seul query (évite N+1).
     */
    private TicketEntity resolveValidTicket(String token) {
        TicketEntity ticket = ticketRepository.findByQrTokenWithRelations(token)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Token invalide ou inexistant. Vérifiez que vous avez bien scanné le bon QR Code."));

        if (isQrTokenExpired(ticket)) {
            throw new IllegalStateException(
                    "Ce QR Code a expiré. Veuillez demander un nouveau QR Code auprès du service.");
        }

        return ticket;
    }

    private boolean isQrTokenExpired(TicketEntity ticket) {
        return ticket.getQrTokenExpiresAt() != null
                && LocalDateTime.now().isAfter(ticket.getQrTokenExpiresAt());
    }

    /** Génère un OTP à 6 chiffres, zero-padded (ex: 007823) */
    private String generateOtp() {
        return String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));
    }

    /**
     * Masque un numéro de téléphone pour l'affichage public.
     * Ex: +221771234567 → +221 **** **67
     *     0612345678   → 06** **** **78
     */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        String last2   = phone.substring(phone.length() - 2);
        String prefix  = phone.length() >= 4 ? phone.substring(0, Math.min(4, phone.length())) : phone;
        return prefix + " **** **" + last2;
    }

    private FeedbackFormDataResponse buildFormData(TicketEntity ticket) {
        return new FeedbackFormDataResponse(
                ticket.getId(),
                ticket.getNumero(),
                ticket.getTypeAppareil(),
                ticket.getMarqueModele(),
                ticket.getDescriptionPanne(),
                ticket.getTechnicien() != null ? ticket.getTechnicien().getNom() : null,
                ticket.getSite().getNom(),
                ticket.isFeedbackSoumis()
        );
    }

    private String encodeQrToBase64(String url) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(url, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
            return Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Erreur lors de la génération du QR Code", e);
        }
    }
}
