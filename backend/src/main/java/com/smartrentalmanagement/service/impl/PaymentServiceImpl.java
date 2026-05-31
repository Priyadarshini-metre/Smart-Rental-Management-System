package com.smartrentalmanagement.service.impl;

import com.smartrentalmanagement.dto.PaymentDTO;
import com.smartrentalmanagement.entity.Booking;
import com.smartrentalmanagement.entity.Payment;
import com.smartrentalmanagement.exception.ResourceNotFoundException;
import com.smartrentalmanagement.repository.BookingRepository;
import com.smartrentalmanagement.repository.PaymentRepository;
import com.smartrentalmanagement.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Booking booking = bookingRepository.findById(paymentDTO.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + paymentDTO.getBookingId()));

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(paymentDTO.getAmount())
                .paymentDate(paymentDTO.getPaymentDate())
                .paymentMethod(paymentDTO.getPaymentMethod())
                .status("PAID") // Mark as PAID upon creation
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return mapToDTO(savedPayment);
    }

    private PaymentDTO mapToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .propertyName(payment.getBooking().getProperty().getName())
                .tenantName(payment.getBooking().getTenant().getFirstName() + " " + payment.getBooking().getTenant().getLastName())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
