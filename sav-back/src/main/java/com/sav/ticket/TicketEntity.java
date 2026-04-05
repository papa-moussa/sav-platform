package com.sav.ticket;

import com.sav.client.ClientEntity;
import com.sav.common.enums.TicketStatut;
import com.sav.common.enums.TypeAppareil;
import com.sav.company.CompanyEntity;
import com.sav.site.SiteEntity;
import com.sav.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets", indexes = {
        @Index(name = "idx_ticket_statut",        columnList = "statut"),
        @Index(name = "idx_ticket_site_id",       columnList = "site_id"),
        @Index(name = "idx_ticket_technicien_id", columnList = "technicien_id"),
        @Index(name = "idx_ticket_client_id",     columnList = "client_id"),
        @Index(name = "idx_ticket_created_at",    columnList = "createdAt"),
        @Index(name = "idx_ticket_qr_token",      columnList = "qrToken")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numero;

    /** Entreprise propriétaire de ce ticket */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private CompanyEntity company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private ClientEntity client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technicien_id")
    private UserEntity technicien;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "site_id", nullable = false)
    private SiteEntity site;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAppareil typeAppareil;

    @Column(nullable = false)
    private String marqueModele;

    private String numeroSerie;

    @Column(nullable = false, length = 2000)
    private String descriptionPanne;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(50)")
    @Builder.Default
    private TicketStatut statut = TicketStatut.RECU;

    @Builder.Default
    private boolean sousGarantie = false;

    private LocalDate dateAchat;

    // ─── Feedback QR Code ─────────────────────────────────────────────────────

    @Column(unique = true)
    private String qrToken;

    private LocalDateTime qrTokenExpiresAt;

    @Builder.Default
    private boolean feedbackSoumis = false;

    // ─── Audit ────────────────────────────────────────────────────────────────

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
