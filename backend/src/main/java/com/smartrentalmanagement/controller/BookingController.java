package com.smartrentalmanagement.controller;

import com.smartrentalmanagement.dto.ApiResponse;
import com.smartrentalmanagement.dto.BookingRequestDTO;
import com.smartrentalmanagement.dto.BookingResponseDTO;
import com.smartrentalmanagement.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getAllBookings() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingById(@PathVariable Long id) {
        BookingResponseDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO bookingRequestDTO) {
        BookingResponseDTO created = bookingService.createBooking(bookingRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", created));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        BookingResponseDTO updated = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", updated));
    }
}
