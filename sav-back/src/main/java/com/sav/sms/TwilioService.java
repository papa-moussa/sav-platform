package com.sav.sms;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service d'envoi de SMS et WhatsApp via Twilio.
 */
@Service
@Slf4j
public class TwilioService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.from-phone}")
    private String fromPhone;

    @Value("${twilio.whatsapp-number}")
    private String whatsappNumber;

    @PostConstruct
    public void init() {
        if (!isSimulation()) {
            Twilio.init(accountSid, authToken);
            // Log de debug pour vérifier si les vraies clés sont chargées
            String maskedSid = accountSid.substring(0, Math.min(6, accountSid.length())) + "...";
            log.info("Twilio initialisé avec succès (SID détecté: {}, from: {})", maskedSid, fromPhone);
        } else {
            log.warn("Twilio est en MODE SIMULATION. (SID actuel: {})", accountSid);
        }
    }

    /**
     * Envoie un SMS OTP au numéro indiqué.
     */
    public void sendOtp(String toPhone, String otp) {
        log.info("[SMS OTP] Destinataire : {} | Code : {}", maskPhone(toPhone), otp);
        
        if (isSimulation()) return;

        try {
            String body = "SAV — Votre code de vérification : " + otp
                    + ". Ce code est valable 5 minutes. Ne le partagez pas.";
            Message message = Message.creator(
                    new PhoneNumber(toPhone),
                    new PhoneNumber(fromPhone),
                    body
            ).create();
            log.info("SMS OTP envoyé à {} (SID: {})", maskPhone(toPhone), message.getSid());
        } catch (Exception e) {
            log.error("Échec envoi SMS OTP vers {} : {}", maskPhone(toPhone), e.getMessage());
        }
    }

    /**
     * Envoie un message WhatsApp au numéro indiqué.
     */
    public void sendWhatsApp(String toPhone, String messageContent) {
        log.info("[WhatsApp] Destinataire : {} | Message : {}", maskPhone(toPhone), messageContent);

        if (isSimulation()) return;

        try {
            String from = whatsappNumber.startsWith("whatsapp:") ? whatsappNumber : "whatsapp:" + whatsappNumber;
            String to = toPhone.startsWith("whatsapp:") ? toPhone : "whatsapp:" + toPhone;

            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(from),
                    messageContent
            ).create();
            log.info("WhatsApp envoyé à {} (SID: {})", maskPhone(toPhone), message.getSid());
        } catch (Exception e) {
            log.error("Échec envoi WhatsApp vers {} : {}", maskPhone(toPhone), e.getMessage());
        }
    }

    private boolean isSimulation() {
        return accountSid == null 
                || accountSid.equals("AC-DEBUG") 
                || accountSid.startsWith("ACxxxxxxxx") 
                || accountSid.isBlank();
    }

    /** Masque un numéro pour les logs (ex: +221771234567 → +221****67) */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        return phone.substring(0, Math.min(4, phone.length())) + "****"
                + phone.substring(phone.length() - 2);
    }
}
