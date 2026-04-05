package com.sav.common.dto;

import java.time.LocalDateTime;

/**
 * Réponse contenant le QR Code encodé en Base64 PNG.
 */
public record QrCodeResponse(
        String base64Image,
        LocalDateTime expiresAt
) {}
