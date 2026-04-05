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
                EnumSet.of(TicketStatut.EN_REPARATION,
                        TicketStatut.EN_ATTENTE_PIECES,
                        TicketStatut.REPARE,
                        TicketStatut.IRREPARABLE));

        TRANSITIONS.put(TicketStatut.EN_REPARATION,
                EnumSet.of(TicketStatut.EN_ATTENTE_PIECES,
                        TicketStatut.REPARE,
                        TicketStatut.IRREPARABLE));

        TRANSITIONS.put(TicketStatut.EN_ATTENTE_PIECES,
                EnumSet.of(TicketStatut.EN_REPARATION,
                        TicketStatut.REPARE,
                        TicketStatut.IRREPARABLE));

        // REPARE et IRREPARABLE → attente feedback obligatoire avant clôture
        TRANSITIONS.put(TicketStatut.REPARE,
                EnumSet.of(TicketStatut.EN_ATTENTE_FEEDBACK));

        TRANSITIONS.put(TicketStatut.IRREPARABLE,
                EnumSet.of(TicketStatut.EN_ATTENTE_FEEDBACK));

        // Clôture autorisée après feedback (ou override admin via service)
        TRANSITIONS.put(TicketStatut.EN_ATTENTE_FEEDBACK,
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

    /**
     * Retourne les transitions autorisées depuis un statut donné.
     */
    public static Set<TicketStatut> getAllowed(TicketStatut from) {
        return TRANSITIONS.getOrDefault(from, EnumSet.noneOf(TicketStatut.class));
    }
}
