package com.smartrentalmanagement.controller;

import com.smartrentalmanagement.dto.ApiResponse;
import com.smartrentalmanagement.dto.PaymentDTO;
import com.smartrentalmanagement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentsByBooking(@PathVariable Long bookingId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Booking payments retrieved successfully", payments));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentDTO>> createPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        PaymentDTO created = paymentService.createPayment(paymentDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment recorded successfully", created));
    }
}
