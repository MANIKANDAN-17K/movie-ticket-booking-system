package com.movie.ticketbooking.repository;



import com.movie.ticketbooking.model.Booking;
import com.movie.ticketbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByMovieId(Long movieId);
}