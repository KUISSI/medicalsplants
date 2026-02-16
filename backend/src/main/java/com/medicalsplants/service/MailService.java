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

    public void sendEmailVerification(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Vérification de votre adresse email");
        message.setText("Bonjour,\n\nVeuillez cliquer sur le lien suivant pour vérifier votre adresse email : "
                + "http://localhost:8080/api/v1/auth/verify-email?token=" + token + "\n\nMerci.");

        try {
            mailSender.send(message);
            log.info("Email de vérification envoyé à {}", to);
        } catch (MailException e) {
            if ("dev".equals(activeProfile)) {
                log.warn("Envoi d'email désactivé en dev. Token de vérification pour {} : {}", to, token);
            } else {
                throw e;
            }
        }
    }
}
