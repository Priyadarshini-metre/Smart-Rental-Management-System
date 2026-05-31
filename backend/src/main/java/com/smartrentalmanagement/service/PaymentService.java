package com.smartrentalmanagement.service;

import com.smartrentalmanagement.dto.PaymentDTO;
import java.util.List;

public interface PaymentService {
    List<PaymentDTO> getAllPayments();
    List<PaymentDTO> getPaymentsByBookingId(Long bookingId);
    PaymentDTO createPayment(PaymentDTO paymentDTO);
}
