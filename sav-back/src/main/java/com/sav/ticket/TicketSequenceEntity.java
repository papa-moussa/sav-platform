package com.sav.ticket;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

/**
 * Entité de séquence personnalisée pour les tickets par année.
 * Permet de générer des numéros atomiques sans s'appuyer sur SELECT MAX(numero).
 */
@Entity
@Table(name = "ticket_sequences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketSequenceEntity {

    @Id
    @Column(length = 4)
    private String year;

    @Builder.Default
    private Long currentValue = 0L;

    public void increment() {
        this.currentValue++;
    }
}
