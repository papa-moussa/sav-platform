package com.sav.stock;

import com.sav.common.enums.TypeAppareil;
import com.sav.company.CompanyEntity;
import com.sav.site.SiteEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "pieces",
        indexes = {
                @Index(name = "idx_piece_site_id",    columnList = "site_id"),
                @Index(name = "idx_piece_categorie",  columnList = "categorieAppareil"),
                @Index(name = "idx_piece_company_id", columnList = "company_id")
        },
        // En multi-tenant, la référence doit être unique PAR entreprise (pas globalement)
        // ⚠️  Migration SQL requise si la table existe déjà :
        //     ALTER TABLE pieces DROP CONSTRAINT pieces_reference_key;
        //     ALTER TABLE pieces ADD CONSTRAINT pieces_reference_company_key UNIQUE (reference, company_id);
        uniqueConstraints = @UniqueConstraint(name = "pieces_reference_company_key", columnNames = {"reference", "company_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class PieceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Référence unique par entreprise (contrainte composite reference+company_id) */
    @Column(nullable = false, columnDefinition = "VARCHAR(100)")
    private String reference;

    @Column(nullable = false)
    private String designation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAppareil categorieAppareil;

    private String marqueCompatible;

    @Column(nullable = false)
    private Integer quantite = 0;

    @Column(nullable = false)
    private Integer seuilAlerte = 5;

    @Column(precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private SiteEntity site;

    /** Entreprise propriétaire de cette pièce */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private CompanyEntity company;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
