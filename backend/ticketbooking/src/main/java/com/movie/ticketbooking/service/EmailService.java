package com.movie.ticketbooking.service;

import com.movie.ticketbooking.model.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("🎬 Booking Confirmed - " + booking.getMovie().getTitle());
            helper.setText(buildEmailBody(booking), true); // true = HTML

            mailSender.send(message);
            log.info("Confirmation email sent to {}", booking.getUser().getEmail());

        } catch (MessagingException e) {
            log.error("Failed to send confirmation email to {}: {}",
                    booking.getUser().getEmail(), e.getMessage());
        }
    }

    private String buildEmailBody(Booking booking) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px;
                          padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <h1 style="color: #e50914; text-align: center;">🎬 MovieBooker</h1>
                <h2 style="color: #333;">Booking Confirmed!</h2>
                
                <p style="color: #555;">Hi <strong>%s</strong>,</p>
                <p style="color: #555;">Your booking has been successfully confirmed. Here are your details:</p>
                
                <table style="width:100%%; border-collapse: collapse; margin: 20px 0;">
                  <tr style="background-color: #f8f8f8;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">🎥 Movie</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">🪑 Seats</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                  </tr>
                  <tr style="background-color: #f8f8f8;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">💳 Total Price</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">₹%.2f</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">📅 Booking Date</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                  </tr>
                  <tr style="background-color: #f8f8f8;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">🆔 Booking ID</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">#%d</td>
                  </tr>
                </table>
                
                <p style="color: #555;">Please arrive 15 minutes before the show starts. Enjoy the movie! 🍿</p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #999; font-size: 12px;">© 2025 MovieBooker. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                booking.getUser().getName(),
                booking.getMovie().getTitle(),
                booking.getNumberOfSeats(),
                booking.getTotalPrice(),
                booking.getBookingDate().toString(),
                booking.getId()
        );
    }
}