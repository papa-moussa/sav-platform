package com.sav.admin;

import com.sav.common.dto.AdminStatsResponse;
import com.sav.common.dto.AdminUserResponse;
import com.sav.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Administration globale")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<PageResponse<AdminUserResponse>> getUsers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("nom"));
        return ResponseEntity.ok(adminService.findAllUsers(search, companyId, pageable));
    }

    @PatchMapping("/users/{id}/actif")
    public ResponseEntity<AdminUserResponse> toggleActif(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserActif(id));
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<AdminUserResponse> resetPassword(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.resetPassword(id));
    }
}
