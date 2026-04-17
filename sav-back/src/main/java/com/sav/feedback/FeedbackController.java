package com.sav.feedback;

import com.sav.common.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints publics (sans authentification) pour le flow de feedback client sécurisé par OTP SMS.
 *
 * <p>Flow complet :
 * <ol>
 *   <li>GET  /api/public/feedback?token=XYZ      → Valide le token QR, envoie un OTP par SMS, retourne le numéro masqué</li>
 *   <li>POST /api/public/feedback/verify-otp     → Vérifie l'OTP, retourne un accessToken + données du formulaire</li>
 *   <li>POST /api/public/feedback/submit         → Soumet le feedback (notes + commentaires) via l'accessToken</li>
 * </ol>
 */
@RestController
@RequestMapping("/api/public/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback Client (Public — OTP SMS)")
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * Étape 1 — Initiation OTP.
     * Valide le token QR, génère un OTP à 6 chiffres (BCrypt), l'envoie par SMS Twilio.
     * Retourne le numéro de téléphone masqué et un message informatif.
     * Si le feedback a déjà été soumis, retourne {@code alreadySubmitted=true}.
     */
    @GetMapping
    @Operation(summary = "Valider le token QR et envoyer l'OTP par SMS")
    public ResponseEntity<OtpInitiateResponse> initiateOtp(@RequestParam String token) {
        return ResponseEntity.ok(feedbackService.initiateOtp(token));
    }

    /**
     * Étape 2 — Vérification OTP.
     * Vérifie le code OTP saisi (3 tentatives max, expiration 5 min).
     * En cas de succès, retourne un accessToken de session (15 min) + les données du formulaire.
     */
    @PostMapping("/verify-otp")
    @Operation(summary = "Vérifier le code OTP et obtenir l'accessToken de session")
    public ResponseEntity<OtpVerifyResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(feedbackService.verifyOtp(request.token(), request.otp()));
    }

    /**
     * Étape 3 — Soumission du feedback.
     * Soumet les notes et commentaires. L'accessToken est à usage unique.
     * Clôture automatiquement le ticket si celui-ci est en statut TERMINE.
     */
    @PostMapping("/submit")
    @Operation(summary = "Soumettre le feedback client (usage unique)")
    public ResponseEntity<Void> submit(@Valid @RequestBody FeedbackRequest request) {
        feedbackService.submitFeedback(request);
        return ResponseEntity.ok().build();
    }
}
