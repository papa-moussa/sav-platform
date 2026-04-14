package com.sav.ticket;

import com.sav.common.dto.TicketResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/public/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicTicketController {

    private final TicketRepository ticketRepository;
    private final TicketService ticketService;

    @GetMapping("/track/{token}")
    public ResponseEntity<TicketResponse> trackTicket(@PathVariable String token) {
        return ticketRepository.findByQrToken(token)
                .map(ticket -> {
                    // Vérifier l'expiration (Optionnel, ici on garde 30 jours par défaut)
                    if (ticket.getQrTokenExpiresAt() != null && ticket.getQrTokenExpiresAt().isBefore(LocalDateTime.now())) {
                        return ResponseEntity.status(410).<TicketResponse>build(); // Gone
                    }
                    // On retourne une version épurée via le mapper du service
                    // (On pourrait créer un DTO public spécifique si besoin de cacher plus d'infos)
                    return ResponseEntity.ok(ticketService.findById(ticket.getId()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/track/{token}/approve-quote")
    public ResponseEntity<Void> approveQuote(@PathVariable String token) {
        return ticketRepository.findByQrToken(token)
                .map(ticket -> {
                    ticketService.startDiagnostic(ticket.getId(), "SYSTEM_CLIENT_PORTAL"); // Exemple de transition
                    // On pourrait ajouter une méthode spécifique approveQuote dans TicketService
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
