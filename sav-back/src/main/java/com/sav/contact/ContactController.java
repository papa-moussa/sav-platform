package com.sav.contact;

import com.sav.common.mail.MailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/contact")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final MailService mailService;

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContact(
            @Valid @RequestBody ContactRequest request) {

        log.info("Nouveau message de contact de {} <{}>", request.name(), request.email());

        mailService.sendContactEmail(request);

        return ResponseEntity.ok(Map.of("message", "Message envoyé avec succès"));
    }
}
