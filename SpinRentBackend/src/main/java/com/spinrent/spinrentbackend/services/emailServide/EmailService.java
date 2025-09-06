package com.spinrent.spinrentbackend.services.emailServide;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingEmail(String to, String gadgetName,String clientName, String startDate, String endDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@spinrent.com"); // dummy sender
        message.setTo(to); // provider email (can be dummy for testing)
        message.setSubject("New Gadget Booking");
        message.setText(
                "Hello,\n\n" +
                        "Your gadget \"" + gadgetName + "\" has been booked.\n" +
                        "By: \"" + clientName + "\"\n" +
                        "Booking Dates: " + startDate + " to " + endDate + "\n\n" +
                        "Thank you,\nSpinRent"
        );
        mailSender.send(message);
    }

    public void sendBookingAcceptedEmail(String to, String gadgetName,String provider, String startDate, String endDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("spinrent@gmail.com"); // dummy sender
        message.setTo(to); // provider email (can be dummy for testing)
        message.setSubject("Gadget Booking Approved");
        message.setText(
                "Hello,\n\n" +
                        "Your gadget \"" + gadgetName + "\"  booking has been successfully approved.\n" +
                        "By: \"" + provider + "\"\n" +
                        "Booking Dates: " + startDate + " to " + endDate + "\n\n" +
                        "Thank you,\nSpinRent"
        );
        mailSender.send(message);
    }

    public void sendBookingRejectedEmail(String to, String gadgetName,String provider, String startDate, String endDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("sprinrent@gmail.com"); // dummy sender
        message.setTo(to); // provider email (can be dummy for testing)
        message.setSubject("Gadget Booking Rejected");
        message.setText(
                "Hello,\n\n" +
                        "Your gadget \"" + gadgetName + "\"  booking has been Rejected.\n" +
                        "By: \"" + provider + "\"\n" +
                        "Booking Dates: " + startDate + " to " + endDate + "\n\n" +
                        "Thank you,\nSpinRent"
        );
        mailSender.send(message);
    }
}
