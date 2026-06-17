package com.movie.ticketbooking.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Enables Spring's @Async support so that EmailService.sendBookingConfirmation()
 * runs in a background thread and doesn't block the booking API response.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
    // Spring Boot auto-configures the thread pool via application.properties
    // spring.task.execution.pool.* properties
}
