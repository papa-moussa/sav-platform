package com.sav.common.dto;

import com.sav.common.enums.BlockingReason;
import com.sav.common.enums.FeedbackStatus;
import com.sav.common.enums.ResultatIntervention;
import com.sav.common.enums.TicketStatut;
import com.sav.common.enums.TypeAppareil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private String numero;
    private Long clientId;
    private String clientNom;
    private Long technicienId;
    private String technicienNom;
    private Long siteId;
    private String siteNom;
    private TypeAppareil typeAppareil;
    private String marqueModele;
    private String numeroSerie;
    private String descriptionPanne;
    private TicketStatut statut;
    private boolean sousGarantie;
    private java.time.LocalDate dateAchat;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<InterventionResponse> interventions;
    private List<TicketActionResponse> actions;
    private List<TicketHistoryResponse> history;
    private boolean feedbackSoumis;
    private FeedbackStatus feedbackStatus;
    private BlockingReason blockingReason;
    private String blockingObservation;
    private ResultatIntervention result;
}
