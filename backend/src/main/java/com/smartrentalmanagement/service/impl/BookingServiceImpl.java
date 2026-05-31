package com.smartrentalmanagement.service.impl;

import com.smartrentalmanagement.dto.BookingRequestDTO;
import com.smartrentalmanagement.dto.BookingResponseDTO;
import com.smartrentalmanagement.entity.Booking;
import com.smartrentalmanagement.entity.Property;
import com.smartrentalmanagement.entity.Tenant;
import com.smartrentalmanagement.exception.BadRequestException;
import com.smartrentalmanagement.exception.ResourceNotFoundException;
import com.smartrentalmanagement.repository.BookingRepository;
import com.smartrentalmanagement.repository.PropertyRepository;
import com.smartrentalmanagement.repository.TenantRepository;
import com.smartrentalmanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToResponseDTO(booking);
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO) {
        Property property = propertyRepository.findById(bookingRequestDTO.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + bookingRequestDTO.getPropertyId()));

        Tenant tenant = tenantRepository.findById(bookingRequestDTO.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + bookingRequestDTO.getTenantId()));

        if ("OCCUPIED".equalsIgnoreCase(property.getStatus())) {
            throw new BadRequestException("This property is already occupied");
        }

        Booking booking = Booking.builder()
                .property(property)
                .tenant(tenant)
                .startDate(bookingRequestDTO.getStartDate())
                .endDate(bookingRequestDTO.getEndDate())
                .monthlyRent(bookingRequestDTO.getMonthlyRent())
                .status("ACTIVE")
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Update Property state
        property.setStatus("OCCUPIED");
        propertyRepository.save(property);

        // Update Tenant state and link to property
        tenant.setProperty(property);
        tenant.setStatus("ACTIVE");
        tenantRepository.save(tenant);

        return mapToResponseDTO(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponseDTO updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        String oldStatus = booking.getStatus();
        booking.setStatus(status.toUpperCase());
        Booking updatedBooking = bookingRepository.save(booking);

        // Transition logic
        if (!"ACTIVE".equalsIgnoreCase(status) && "ACTIVE".equalsIgnoreCase(oldStatus)) {
            // Free the property
            Property property = booking.getProperty();
            property.setStatus("VACANT");
            propertyRepository.save(property);

            // Free the tenant
            Tenant tenant = booking.getTenant();
            if (tenant.getProperty() != null && tenant.getProperty().getId().equals(property.getId())) {
                tenant.setProperty(null);
                tenant.setStatus("INACTIVE");
                tenantRepository.save(tenant);
            }
        } else if ("ACTIVE".equalsIgnoreCase(status) && !"ACTIVE".equalsIgnoreCase(oldStatus)) {
            // Check if property is free
            Property property = booking.getProperty();
            if ("OCCUPIED".equalsIgnoreCase(property.getStatus())) {
                throw new BadRequestException("Cannot activate booking. Property is occupied");
            }
            property.setStatus("OCCUPIED");
            propertyRepository.save(property);

            Tenant tenant = booking.getTenant();
            tenant.setProperty(property);
            tenant.setStatus("ACTIVE");
            tenantRepository.save(tenant);
        }

        return mapToResponseDTO(updatedBooking);
    }

    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .propertyId(booking.getProperty().getId())
                .propertyName(booking.getProperty().getName())
                .tenantId(booking.getTenant().getId())
                .tenantName(booking.getTenant().getFirstName() + " " + booking.getTenant().getLastName())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .monthlyRent(booking.getMonthlyRent())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
