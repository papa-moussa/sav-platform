package com.sav.company;

import com.sav.common.enums.CompanyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies", indexes = {
        @Index(name = "idx_company_slug",   columnList = "slug"),
        @Index(name = "idx_company_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nom complet de l'entreprise (ex: "NSIA Assurances") */
    @Column(nullable = false)
    private String name;

    /** Identifiant URL unique (ex: "nsia", "sonatel") */
    @Column(unique = true, nullable = false)
    private String slug;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    private String address;

    /** URL du logo (stocké en CDN ou chemin relatif) */
    private String logoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(30)")
    @Builder.Default
    private CompanyStatus status = CompanyStatus.ACTIVE;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt  = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
