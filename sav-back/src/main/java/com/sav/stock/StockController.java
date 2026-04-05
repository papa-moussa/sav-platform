package com.sav.stock;

import com.sav.common.dto.PageResponse;
import com.sav.stock.dto.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@Tag(name = "Stock", description = "Gestion du stock de pièces détachées")
public class StockController {

    private final StockService stockService;

    @GetMapping("/pieces")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIEN','RECEPTIONNISTE')")
    public ResponseEntity<PageResponse<PieceResponse>> getPieces(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long siteId,
            @RequestParam(required = false) Boolean alerteOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("designation"));
        return ResponseEntity.ok(stockService.findAll(search, siteId, alerteOnly, pageable));
    }

    @GetMapping("/pieces/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIEN','RECEPTIONNISTE')")
    public ResponseEntity<PieceResponse> getPiece(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.findById(id));
    }

    @PostMapping("/pieces")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PieceResponse> createPiece(@Valid @RequestBody PieceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockService.create(req));
    }

    @PutMapping("/pieces/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PieceResponse> updatePiece(
            @PathVariable Long id,
            @Valid @RequestBody PieceRequest req
    ) {
        return ResponseEntity.ok(stockService.update(id, req));
    }

    @PostMapping("/pieces/{id}/entree")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIEN')")
    public ResponseEntity<MouvementStockResponse> entree(
            @PathVariable Long id,
            @Valid @RequestBody EntreeStockRequest req,
            Authentication auth
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockService.entreeStock(id, req, auth.getName()));
    }

    @PostMapping("/pieces/{id}/sortie")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIEN')")
    public ResponseEntity<MouvementStockResponse> sortie(
            @PathVariable Long id,
            @Valid @RequestBody SortieStockRequest req,
            Authentication auth
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockService.sortieStock(id, req, auth.getName()));
    }

    @GetMapping("/pieces/{id}/mouvements")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIEN')")
    public ResponseEntity<List<MouvementStockResponse>> getMouvements(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getMouvements(id));
    }

    @GetMapping("/interventions/{interventionId}/pieces")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIEN','RECEPTIONNISTE')")
    public ResponseEntity<List<MouvementStockResponse>> getPiecesByIntervention(
            @PathVariable Long interventionId
    ) {
        return ResponseEntity.ok(stockService.getMouvementsByIntervention(interventionId));
    }

    @GetMapping("/alertes/count")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIEN','RECEPTIONNISTE')")
    public ResponseEntity<Map<String, Long>> countAlertes() {
        return ResponseEntity.ok(Map.of("count", stockService.countAlertes()));
    }
}
