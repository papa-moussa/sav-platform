package com.sav.company;

import com.sav.common.dto.CompanyRequest;
import com.sav.common.dto.CompanyResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints réservés au SUPER_ADMIN — gestion des entreprises (tenants).
 * Préfixe : /api/admin/companies
 */
@RestController
@RequestMapping("/api/admin/companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
@Tag(name = "Companies (SUPER_ADMIN)")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "Lister toutes les entreprises")
    public ResponseEntity<List<CompanyResponse>> getAll() {
        return ResponseEntity.ok(companyService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une entreprise")
    public ResponseEntity<CompanyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une entreprise")
    public ResponseEntity<CompanyResponse> create(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une entreprise")
    public ResponseEntity<CompanyResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(companyService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activer / Suspendre une entreprise")
    public ResponseEntity<CompanyResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.toggleStatus(id));
    }
}
