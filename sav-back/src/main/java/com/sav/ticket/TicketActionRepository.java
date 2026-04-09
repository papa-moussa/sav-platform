package com.sav.ticket;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketActionRepository extends JpaRepository<TicketActionEntity, Long> {
    List<TicketActionEntity> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
