package com.sav.sms;

// import com.twilio.Twilio;
// import com.twilio.rest.api.v2010.account.Message;
// import com.twilio.type.PhoneNumber;
// import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service d'envoi de SMS OTP.
 * Twilio est désactivé pour l'instant — le code OTP est simplement loggué en INFO.
 * Pour activer Twilio : décommenter les imports, @PostConstruct et le bloc try/catch dans sendOtp().
 */
@Service
@Slf4j
public class TwilioService {

//    @Value("${twilio.account-sid}")
//    private String accountSid;
//
//    @Value("${twilio.auth-token}")
//    private String authToken;
//
//    @Value("${twilio.from-phone}")
//    private String fromPhone;
//
//    @PostConstruct
//    public void init() {
//        Twilio.init(accountSid, authToken);
//        log.info("Twilio initialisé (from: {})", fromPhone);
//    }

    /**
     * Envoie un SMS OTP au numéro indiqué.
     * Pour l'instant : log INFO uniquement (Twilio commenté).
     *
     * @param toPhone numéro de téléphone du destinataire
     * @param otp     code OTP à 6 chiffres
     */
    public void sendOtp(String toPhone, String otp) {
        log.info("═══════════════════════════════════════════════");
        log.info("[OTP] Destinataire : {} | Code : {}", maskPhone(toPhone), otp);
        log.info("═══════════════════════════════════════════════");

//        try {
//            String body = "SAV — Votre code de vérification : " + otp
//                    + ". Ce code est valable 5 minutes. Ne le partagez pas.";
//            Message message = Message.creator(
//                    new PhoneNumber(toPhone),
//                    new PhoneNumber(fromPhone),
//                    body
//            ).create();
//            log.info("SMS OTP envoyé à {} (SID: {})", maskPhone(toPhone), message.getSid());
//        } catch (Exception e) {
//            log.error("Échec envoi SMS OTP vers {} : {}", maskPhone(toPhone), e.getMessage());
//            throw new RuntimeException(
//                    "Impossible d'envoyer le SMS de vérification. Veuillez contacter le service.", e);
//        }
    }

    /** Masque un numéro pour les logs (ex: +221771234567 → +221****67) */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        return phone.substring(0, Math.min(4, phone.length())) + "****"
                + phone.substring(phone.length() - 2);
    }
}
