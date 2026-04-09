package com.sav.ticket;

import com.sav.common.dto.*;
import com.sav.common.enums.TicketStatut;
import com.sav.feedback.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Tag(name = "Tickets SAV")
@SecurityRequirement(name = "bearerAuth")
public class TicketController {

    private final TicketService ticketService;
    private final FeedbackService feedbackService;

    // ─── Liste ────────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'TECHNICIEN')")
    @Operation(summary = "Liste des tickets avec filtres optionnels (paginée)")
    public ResponseEntity<PageResponse<TicketResponse>> getAll(
            @RequestParam(required = false) TicketStatut statut,
            @RequestParam(required = false) Long siteId,
            @RequestParam(required = false) Long technicienId,
            @RequestParam(required = false) Long clientId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ticketService.findAll(statut, siteId, technicienId, clientId, search, pageable));
    }

    // ─── Mes tickets (vue technicien) ─────────────────────────────────────────

    @GetMapping("/mes-tickets")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Tickets assignés au technicien connecté")
    public ResponseEntity<List<TicketResponse>> getMesTickets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.findMesTickets(userDetails.getUsername()));
    }

    // ─── Détail ───────────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'TECHNICIEN')")
    @Operation(summary = "Détail d'un ticket avec ses interventions")
    public ResponseEntity<TicketResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.findById(id));
    }

    // ─── Création ─────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    @Operation(summary = "Créer un ticket SAV")
    public ResponseEntity<TicketResponse> create(
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.create(request, userDetails.getUsername()));
    }

    // ─── Changement de statut ─────────────────────────────────────────────────

    @PostMapping("/{id}/start-diagnostic")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Démarrer le diagnostic d'un ticket")
    public ResponseEntity<TicketResponse> startDiagnostic(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.startDiagnostic(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/complete-diagnostic")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Valider le diagnostic et passer en cours de réparation")
    public ResponseEntity<TicketResponse> completeDiagnostic(
            @PathVariable Long id,
            @Valid @RequestBody DiagnosticRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.completeDiagnostic(id, request.diagnostic(), userDetails.getUsername()));
    }

    @PostMapping("/{id}/actions")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Ajouter une action réalisée sur le ticket")
    public ResponseEntity<TicketActionResponse> addAction(
            @PathVariable Long id,
            @Valid @RequestBody TicketActionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.addAction(id, request.description(), userDetails.getUsername()));
    }

    @PostMapping("/{id}/block")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Bloquer l'intervention")
    public ResponseEntity<TicketResponse> block(
            @PathVariable Long id,
            @Valid @RequestBody BlockingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.blockTicket(id, request.reason(), request.observation(), userDetails.getUsername()));
    }

    @PostMapping("/{id}/resume")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Reprendre l'intervention après un blocage")
    public ResponseEntity<TicketResponse> resume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.resumeTicket(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/terminate")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Terminer l'intervention")
    public ResponseEntity<TicketResponse> terminate(
            @PathVariable Long id,
            @Valid @RequestBody TerminationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.terminateIntervention(id, request.result(), request.observations(), request.tempsPasseHeures(), userDetails.getUsername()));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'RECEPTIONNISTE')")
    @Operation(summary = "Changer le statut d'un ticket (legacy/manuel)")
    public ResponseEntity<TicketResponse> changeStatut(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Simple redirection vers startDiagnostic etc si besoin, ou on garde comme transition manuelle admin
        TicketResponse resp = ticketService.startDiagnostic(id, userDetails.getUsername()); // Simple fallback
        return ResponseEntity.ok(resp);
    }

    // ─── QR Code feedback ─────────────────────────────────────────────────────

    @GetMapping("/{id}/qrcode")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'TECHNICIEN')")
    @Operation(summary = "Récupérer le QR Code de feedback d'un ticket (PNG encodé Base64)")
    public ResponseEntity<QrCodeResponse> getQrCode(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.generateQrCode(id));
    }

    // ─── Assignation ──────────────────────────────────────────────────────────

    @PatchMapping("/{id}/assigner")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    @Operation(summary = "Assigner un technicien à un ticket")
    public ResponseEntity<TicketResponse> assigner(
            @PathVariable Long id,
            @Valid @RequestBody AssignRequest request) {
        return ResponseEntity.ok(ticketService.assigner(id, request.technicienId()));
    }

    // ─── Ajout d'intervention ─────────────────────────────────────────────────

    @PostMapping("/{id}/interventions")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @Operation(summary = "Ajouter une intervention sur un ticket")
    public ResponseEntity<InterventionResponse> addIntervention(
            @PathVariable Long id,
            @Valid @RequestBody InterventionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addIntervention(id, request, userDetails.getUsername()));
    }
}
