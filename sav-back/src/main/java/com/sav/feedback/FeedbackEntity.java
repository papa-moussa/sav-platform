package com.sav.feedback;

import com.sav.ticket.TicketEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks", indexes = {
        @Index(name = "idx_feedback_ticket_id", columnList = "ticket_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false, unique = true)
    private TicketEntity ticket;

    /** Note technicien (1 à 5) */
    @Column(nullable = false)
    private Integer noteTechnicien;

    @Column(length = 1000)
    private String commentaireTechnicien;

    /** Note entreprise (1 à 5) */
    @Column(nullable = false)
    private Integer noteEntreprise;

    @Column(length = 1000)
    private String commentaireEntreprise;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }
}
