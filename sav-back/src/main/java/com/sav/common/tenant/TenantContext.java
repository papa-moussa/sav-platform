package com.sav.common.tenant;

/**
 * Contexte tenant (ThreadLocal) — stocke le companyId de l'utilisateur courant.
 *
 * <p>Alimenté par {@code JwtFilter} à chaque requête HTTP.
 * Nettoyé après chaque requête pour éviter les fuites mémoire (ThreadLocal leak).
 *
 * <p>Valeur {@code null} = SUPER_ADMIN (aucune restriction tenant).
 */
public final class TenantContext {

    private static final ThreadLocal<Long> COMPANY_ID = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(Long companyId) {
        COMPANY_ID.set(companyId);
    }

    /** Retourne le companyId courant, ou {@code null} si SUPER_ADMIN / pas de contexte. */
    public static Long get() {
        return COMPANY_ID.get();
    }

    public static void clear() {
        COMPANY_ID.remove();
    }

    /** {@code true} si l'utilisateur courant est SUPER_ADMIN (pas de restriction tenant). */
    public static boolean isSuperAdmin() {
        return COMPANY_ID.get() == null;
    }
}
