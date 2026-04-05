package com.sav.feedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackEntity, Long> {

    Optional<FeedbackEntity> findByTicketId(Long ticketId);

    boolean existsByTicketId(Long ticketId);

    // ─── Reporting ────────────────────────────────────────────────────────────

    @Query("SELECT AVG(f.noteTechnicien) FROM FeedbackEntity f " +
           "WHERE (:siteId IS NULL OR f.ticket.site.id = :siteId)")
    Double avgNoteTechnicien(@Param("siteId") Long siteId);

    @Query("SELECT AVG(f.noteEntreprise) FROM FeedbackEntity f " +
           "WHERE (:siteId IS NULL OR f.ticket.site.id = :siteId)")
    Double avgNoteEntreprise(@Param("siteId") Long siteId);

    @Query("SELECT f FROM FeedbackEntity f JOIN FETCH f.ticket WHERE f.ticket.site.id = :siteId " +
           "ORDER BY f.submittedAt DESC")
    List<FeedbackEntity> findBySiteIdOrderBySubmittedAtDesc(@Param("siteId") Long siteId);

    @Query("SELECT AVG((f.noteTechnicien + f.noteEntreprise) / 2.0) FROM FeedbackEntity f")
    Double avgGlobalRating();
}
