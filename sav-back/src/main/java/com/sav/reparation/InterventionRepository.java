package com.sav.reparation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<InterventionEntity, Long> {

    // JOIN FETCH technicien pour éviter N+1 dans toInterventionResponse()
    @Query("""
            SELECT i FROM InterventionEntity i
            JOIN FETCH i.technicien
            WHERE i.ticket.id = :ticketId
            ORDER BY i.createdAt ASC
            """)
    List<InterventionEntity> findByTicketIdOrderByCreatedAtAsc(@Param("ticketId") Long ticketId);
}
