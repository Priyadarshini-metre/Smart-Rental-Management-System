package com.smartrentalmanagement.service;

import com.smartrentalmanagement.dto.BookingRequestDTO;
import com.smartrentalmanagement.dto.BookingResponseDTO;
import java.util.List;

public interface BookingService {
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO getBookingById(Long id);
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO);
    BookingResponseDTO updateBookingStatus(Long id, String status);
}
