package com.sav.ticket;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketSequenceRepository extends JpaRepository<TicketSequenceEntity, String> {

    /**
     * Recherche la séquence pour une année donnée en verrouillant la ligne (SELECT ... FOR UPDATE).
     * Garantit qu'un seul thread peut incrémenter le compteur à la fois,
     * même si l'un de ces threads est sur une autre instance du serveur.
     *
     * @param year l'année (ex: "2026")
     * @return la séquence verrouillée si elle existe
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM TicketSequenceEntity s WHERE s.year = :year")
    Optional<TicketSequenceEntity> findByYearWithLock(@Param("year") String year);
}
