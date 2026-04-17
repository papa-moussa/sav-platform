package com.sav.common.mail;

import com.sav.contact.ContactRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@savplatform.com}")
    private String from;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    /**
     * Envoie les identifiants de connexion au nouvel administrateur d'une company.
     * Si le mail est désactivé (dev), les identifiants sont loggués.
     */
    public void sendCompanyAdminCredentials(String toEmail, String companyName,
                                            String adminEmail, String plainPassword) {
        String subject = "[SAV Platform] Votre compte administrateur — " + companyName;
        String html = buildCredentialsEmail(companyName, adminEmail, plainPassword);

        if (!mailEnabled) {
            log.info("=== [MAIL DISABLED] Identifiants pour {} ===", companyName);
            log.info("  Destinataire : {}", toEmail);
            log.info("  Email admin  : {}", adminEmail);
            log.info("  Mot de passe : {}", plainPassword);
            log.info("  URL          : {}", frontendUrl);
            log.info("==============================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Mail d'identifiants envoyé à {} pour la company '{}'", toEmail, companyName);
        } catch (MessagingException e) {
            log.error("Échec de l'envoi du mail à {} : {}", toEmail, e.getMessage());
            // Ne pas faire échouer la création de la company si le mail plante
        }
    }

    /**
     * Envoie le message du formulaire de contact de la landing page.
     * Reçu à contact@sama-sav.com avec les infos de l'expéditeur.
     */
    public void sendContactEmail(ContactRequest request) {
        String subject = "[sama-sav.com] Nouveau message de " + request.name();
        String html = buildContactEmail(request);

        if (!mailEnabled) {
            log.info("=== [MAIL DISABLED] Contact de {} <{}> ===", request.name(), request.email());
            log.info("  Entreprise : {}", request.company() != null ? request.company() : "N/A");
            log.info("  Message    : {}", request.message());
            log.info("==============================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo("contact@sama-sav.com");
            helper.setReplyTo(request.email());
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Mail de contact envoyé depuis {} <{}>", request.name(), request.email());
        } catch (MessagingException e) {
            log.error("Échec de l'envoi du mail de contact : {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'envoi du mail", e);
        }
    }

    private String buildContactEmail(ContactRequest req) {
        String company = (req.company() != null && !req.company().isBlank())
                ? req.company() : "Non renseignée";
        return """
            <!DOCTYPE html>
            <html lang="fr">
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
                <tr><td align="center">
                  <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <tr>
                      <td style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:28px 40px;">
                        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">Nouveau message de contact</h1>
                        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">sama-sav.com</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:32px 40px;">
                        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:12px;padding:20px;margin-bottom:24px;">
                          <tr><td style="padding:6px 0;">
                            <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Nom</span><br>
                            <span style="color:#1e293b;font-size:15px;font-weight:600;">%s</span>
                          </td></tr>
                          <tr><td style="padding:6px 0;border-top:1px solid #e2e8f0;">
                            <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Email</span><br>
                            <a href="mailto:%s" style="color:#2563eb;font-size:15px;">%s</a>
                          </td></tr>
                          <tr><td style="padding:6px 0;border-top:1px solid #e2e8f0;">
                            <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Entreprise</span><br>
                            <span style="color:#1e293b;font-size:15px;">%s</span>
                          </td></tr>
                        </table>
                        <div style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:0 8px 8px 0;padding:16px 20px;">
                          <p style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Message</p>
                          <p style="color:#1e293b;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">%s</p>
                        </div>
                        <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;">
                          Répondre directement à cet email pour contacter %s.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f8fafc;padding:16px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                        <p style="color:#94a3b8;font-size:12px;margin:0;">sama-sav.com — Formulaire de contact</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(req.name(), req.email(), req.email(), company, req.message(), req.name());
    }

    private String buildCredentialsEmail(String companyName, String adminEmail, String plainPassword) {
        return """
            <!DOCTYPE html>
            <html lang="fr">
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
                <tr><td align="center">
                  <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:36px 40px;text-align:center;">
                        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">SAV Platform</h1>
                        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Bienvenue sur votre espace SAV</p>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">
                        <h2 style="color:#1e293b;font-size:20px;margin:0 0 8px;">Votre compte est prêt !</h2>
                        <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 28px;">
                          L'entreprise <strong style="color:#1e293b;">%s</strong> a été créée sur SAV Platform.
                          Voici vos identifiants pour accéder à votre espace de gestion.
                        </p>
                        <!-- Credentials box -->
                        <div style="background:#f1f5f9;border-radius:12px;padding:24px;margin-bottom:28px;">
                          <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:8px 0;">
                                <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Email</span><br>
                                <span style="color:#1e293b;font-size:16px;font-weight:600;font-family:monospace;">%s</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:12px 0 8px;border-top:1px solid #e2e8f0;">
                                <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Mot de passe temporaire</span><br>
                                <span style="color:#1e293b;font-size:18px;font-weight:700;font-family:monospace;letter-spacing:2px;">%s</span>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!-- CTA -->
                        <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                          <tr>
                            <td style="background:#2563eb;border-radius:10px;">
                              <a href="%s/login" style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-weight:600;font-size:15px;">
                                Accéder à mon espace →
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0;">
                          ⚠️ Pour votre sécurité, changez ce mot de passe dès votre première connexion.<br>
                          Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                        <p style="color:#94a3b8;font-size:12px;margin:0;">SAV Platform — Ce message est automatique, ne pas répondre.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(companyName, adminEmail, plainPassword, frontendUrl);
    }
}
