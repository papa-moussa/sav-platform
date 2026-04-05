package com.sav.feedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackOtpRepository extends JpaRepository<FeedbackOtpEntity, Long> {

    /**
     * Retrouve l'OTP actif le plus récent pour un token QR donné.
     * "Actif" = non encore utilisé.
     */
    Optional<FeedbackOtpEntity> findTopByQrTokenAndUsedFalseOrderByCreatedAtDesc(String qrToken);

    /**
     * Retrouve un OTP validé par son token de session (après vérification OTP réussie).
     */
    Optional<FeedbackOtpEntity> findByVerifiedToken(String verifiedToken);
}
