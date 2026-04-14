package com.sav.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TypeAppareil {
    REFRIGERATEUR(5),
    LAVE_LINGE(5),
    LAVE_VAISSELLE(7),
    CLIMATISEUR(3),
    CUISINIERE(4),
    CONGELATEUR(5),
    FOUR(4),
    AUTRE(7);

    private final int defaultSlaDays;
}
