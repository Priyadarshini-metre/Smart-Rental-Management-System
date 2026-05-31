package com.smartrentalmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyDTO {
    private Long id;

    @NotBlank(message = "Property name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;

    @NotBlank(message = "Property type is required")
    private String type;

    @NotNull(message = "Rent amount is required")
    @Positive(message = "Rent amount must be greater than zero")
    private Double rentAmount;

    private String status; // VACANT, OCCUPIED
    private String imageUrl;
}
