package com.medicalsplants.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmailVerification(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Vérification de votre adresse email");
        message.setText("Bonjour,\n\nVeuillez cliquer sur le lien suivant pour vérifier votre adresse email : "
                + "http://localhost:8080/api/v1/auth/verify-email?token=" + token + "\n\nMerci.");
        mailSender.send(message);
    }
}
