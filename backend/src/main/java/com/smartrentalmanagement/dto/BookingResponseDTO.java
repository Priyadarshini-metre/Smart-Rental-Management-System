package com.smartrentalmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {
    private Long id;
    private Long propertyId;
    private String propertyName;
    private Long tenantId;
    private String tenantName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double monthlyRent;
    private String status;
    private LocalDateTime createdAt;
}
