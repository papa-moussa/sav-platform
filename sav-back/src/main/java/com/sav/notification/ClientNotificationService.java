package com.sav.notification;

import com.sav.sms.TwilioService;
import com.sav.ticket.TicketEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service pour l'envoi de notifications WhatsApp automatisées aux clients SAV.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClientNotificationService {

    private final TwilioService twilioService;

    public void sendStatusUpdate(TicketEntity ticket) {
        String phone = ticket.getClient().getTelephone();
        if (phone == null || phone.isBlank()) {
            log.warn("Aucun téléphone pour le client {}, notification annulée.", ticket.getClient().getNom());
            return;
        }

        String message = buildMessage(ticket);
        if (message != null) {
            twilioService.sendWhatsApp(phone, message);
        }
    }

    private String buildMessage(TicketEntity ticket) {
        String clientNom = ticket.getClient().getNom();
        String ref = ticket.getNumero();
        String machine = ticket.getMarqueModele();
        String trackingUrl = "http://localhost:4201/track/" + ticket.getQrToken();

        return switch (ticket.getStatut()) {
            case RECU -> 
                String.format("Bonjour %s, votre %s a bien été reçu (Réf: %s). Suivez l'avancement ici : %s", 
                clientNom, machine, ref, trackingUrl);
            
            case EN_DIAGNOSTIC ->
                String.format("Bonjour %s, le diagnostic de votre %s (%s) a commencé.", 
                clientNom, machine, ref);

            case DEVIS_ENVOYE ->
                String.format("Bonjour %s, un devis de %s FCFA est disponible pour votre %s (%s). Validez-le ici : %s", 
                clientNom, ticket.getQuoteAmount() != null ? ticket.getQuoteAmount() : "---", machine, ref, trackingUrl);

            case TERMINE ->
                String.format("Bonjour %s, la réparation de votre %s (%s) est terminée et en phase de test.", 
                clientNom, machine, ref);

            case PRET_POUR_RECUPERATION ->
                String.format("Bonne nouvelle %s ! Votre %s (%s) est prêt. Vous pouvez venir le retirer à l'agence %s.", 
                clientNom, machine, ref, ticket.getSite().getNom());

            default -> null;
        };
    }
}
