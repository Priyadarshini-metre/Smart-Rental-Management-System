package com.smartrentalmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Property name is required")
    @Column(length = 100)
    private String name;

    @NotBlank(message = "Address is required")
    @Column(length = 255)
    private String address;

    @NotBlank(message = "Location is required")
    @Column(length = 100)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Property type is required")
    @Column(length = 50)
    private String type; // e.g. Apartment, House, Room

    @NotNull(message = "Rent amount is required")
    @Positive(message = "Rent amount must be greater than zero")
    @Column(name = "rent_amount")
    private Double rentAmount;

    @NotBlank
    @Column(length = 20)
    @Builder.Default
    private String status = "VACANT"; // VACANT, OCCUPIED

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "VACANT";
        }
    }
}
