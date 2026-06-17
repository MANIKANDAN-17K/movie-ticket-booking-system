package com.movie.ticketbooking.controller;

import com.movie.ticketbooking.model.Booking;
import com.movie.ticketbooking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    // USER - Create a new booking
    // Request body: { "movieId": 1, "numberOfSeats": 2 }
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Booking> createBooking(@RequestBody Map<String, Object> request) {
        Long movieId = Long.valueOf(request.get("movieId").toString());
        int numberOfSeats = Integer.parseInt(request.get("numberOfSeats").toString());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(movieId, numberOfSeats));
    }

    // USER - Get own bookings
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Booking>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    // ADMIN - Get all bookings
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}