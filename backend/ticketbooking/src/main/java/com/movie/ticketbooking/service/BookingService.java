package com.movie.ticketbooking.service;

import com.movie.ticketbooking.model.Booking;
import com.movie.ticketbooking.model.Movie;
import com.movie.ticketbooking.model.User;
import com.movie.ticketbooking.repository.BookingRepository;
import com.movie.ticketbooking.repository.MovieRepository;
import com.movie.ticketbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public Booking createBooking(Long movieId, int numberOfSeats) {
        // Resolve the currently authenticated user (JWT subject = email)
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // Validate movie
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + movieId));

        // Check seat availability
        if (movie.getAvailableSeats() < numberOfSeats) {
            throw new RuntimeException("Not enough seats available. Available: " + movie.getAvailableSeats());
        }

        // Deduct seats
        movie.setAvailableSeats(movie.getAvailableSeats() - numberOfSeats);
        movieRepository.save(movie);

        // Build and save booking
        Booking booking = Booking.builder()
                .user(user)
                .movie(movie)
                .numberOfSeats(numberOfSeats)
                .totalPrice(movie.getPrice() * numberOfSeats)
                .bookingDate(LocalDateTime.now())
                .status("CONFIRMED")
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Send async confirmation email
        emailService.sendBookingConfirmation(savedBooking);

        return savedBooking;
    }

    // USER - get their own bookings
    public List<Booking> getMyBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return bookingRepository.findByUser(user);
    }

    // ADMIN - get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}