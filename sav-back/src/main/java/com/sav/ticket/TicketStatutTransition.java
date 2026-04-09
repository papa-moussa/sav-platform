package com.sav.ticket;

import com.sav.common.enums.TicketStatut;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Définit les transitions de statut autorisées pour un ticket SAV.
 * Implémente un workflow strict conforme aux specs.
 */
public final class TicketStatutTransition {

    private static final Map<TicketStatut, Set<TicketStatut>> TRANSITIONS =
            new EnumMap<>(TicketStatut.class);

    static {
        TRANSITIONS.put(TicketStatut.RECU,
                EnumSet.of(TicketStatut.EN_DIAGNOSTIC));

        TRANSITIONS.put(TicketStatut.EN_DIAGNOSTIC,
                EnumSet.of(TicketStatut.EN_COURS));

        TRANSITIONS.put(TicketStatut.EN_COURS,
                EnumSet.of(TicketStatut.TERMINE));

        TRANSITIONS.put(TicketStatut.TERMINE,
                EnumSet.of(TicketStatut.CLOTURE));

        TRANSITIONS.put(TicketStatut.CLOTURE,
                EnumSet.noneOf(TicketStatut.class));
    }

    private TicketStatutTransition() {}

    /**
     * Vérifie si la transition de {@code from} vers {@code to} est autorisée.
     */
    public static boolean isAllowed(TicketStatut from, TicketStatut to) {
        Set<TicketStatut> allowed = TRANSITIONS.getOrDefault(from, EnumSet.noneOf(TicketStatut.class));
        return allowed.contains(to);
    }

}
