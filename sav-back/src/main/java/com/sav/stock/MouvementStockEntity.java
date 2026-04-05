package com.sav.stock;

import com.sav.common.enums.TypeMouvementStock;
import com.sav.reparation.InterventionEntity;
import com.sav.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "mouvements_stock", indexes = {
        @Index(name = "idx_mouvement_piece_id",        columnList = "piece_id"),
        @Index(name = "idx_mouvement_intervention_id", columnList = "intervention_id")
})
@Getter
@Setter
@NoArgsConstructor
public class MouvementStockEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "piece_id", nullable = false)
    private PieceEntity piece;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeMouvementStock type;

    @Column(nullable = false)
    private Integer quantite;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "intervention_id", nullable = true)
    private InterventionEntity intervention;

    @Column(length = 500)
    private String motif;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private UserEntity createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
