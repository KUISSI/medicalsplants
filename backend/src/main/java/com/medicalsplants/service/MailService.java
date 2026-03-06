package com.medicalsplants.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${app.mail.from:noreply@medicalsplants.com}")
    private String mailFrom;

    /**
     * Envoie un email de vérification d'adresse email à l'utilisateur.
     *
     * @param to L'adresse email du destinataire
     * @param token Le token de validation à inclure dans le lien
     */
    public void sendEmailVerification(String to, String token) {
        log.info("Tentative d'envoi d'email de vérification à {}", to);
        System.out.println(">>> [MailService] Appel sendEmailVerification pour " + to); // Ajouté

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(mailFrom);
        message.setSubject("Vérification de votre adresse email");
        String verificationLink = frontendUrl + "/verify-email?token=" + token;
        message.setText("Bonjour,\n\nVeuillez cliquer sur le lien suivant pour vérifier votre adresse email : "
                + verificationLink + "\n\nMerci.");

        try {
            mailSender.send(message);
            log.info("Email de vérification envoyé à {}", to);
            System.out.println(">>> [MailService] Email envoyé à " + to);
        } catch (MailException e) {
            log.error("Erreur lors de l'envoi de l'email de vérification à {} : {}", to, e.getMessage(), e);
            System.out.println(">>> [MailService] Erreur d'envoi à " + to + " : " + e.getMessage());
            throw e;
        }
    }
}
