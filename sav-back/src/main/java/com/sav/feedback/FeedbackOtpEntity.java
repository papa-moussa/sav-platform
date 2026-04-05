package com.sav.feedback;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Stocke les OTP générés pour la vérification du feedback client.
 * L'OTP est hashé en BCrypt — jamais stocké en clair.
 */
@Entity
@Table(name = "feedback_otps", indexes = {
        @Index(name = "idx_feedback_otp_qr_token",      columnList = "qrToken"),
        @Index(name = "idx_feedback_otp_verified_token", columnList = "verifiedToken")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackOtpEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Token QR du ticket associé (copie de TicketEntity.qrToken) */
    @Column(nullable = false)
    private String qrToken;

    /** OTP haché en BCrypt — jamais exposé */
    @Column(nullable = false)
    private String hashedOtp;

    /** Expiration de l'OTP (5 min par défaut) */
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    /** Nombre de tentatives de saisie incorrectes */
    @Builder.Default
    private int attempts = 0;

    /** true dès que l'OTP a été utilisé (valide ou invalidé manuellement) */
    @Builder.Default
    private boolean used = false;

    /**
     * Token de session généré après vérification OTP réussie.
     * Permet de soumettre le formulaire sans renvoyer l'OTP.
     */
    @Column(unique = true)
    private String verifiedToken;

    /** Expiration du token de session (15 min par défaut) */
    private LocalDateTime verifiedTokenExpiresAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
