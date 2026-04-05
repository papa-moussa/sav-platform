package com.sav.reparation;

import com.sav.common.enums.ResultatIntervention;
import com.sav.ticket.TicketEntity;
import com.sav.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interventions", indexes = {
        @Index(name = "idx_intervention_ticket_id", columnList = "ticket_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "technicien_id", nullable = false)
    private UserEntity technicien;

    @Column(nullable = false, length = 2000)
    private String diagnostic;

    @Column(nullable = false, length = 2000)
    private String actionsRealisees;

    @Column(length = 1000)
    private String observations;

    private Double tempsPasseHeures;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResultatIntervention resultat = ResultatIntervention.EN_COURS;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
