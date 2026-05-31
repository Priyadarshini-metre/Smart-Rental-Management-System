package com.smartrentalmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Column(name = "first_name", length = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(name = "last_name", length = 50)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true, length = 100)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Column(length = 20)
    private String phone;

    @NotBlank(message = "ID Proof is required")
    @Column(name = "id_proof", length = 100)
    private String idProof;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "property_id")
    private Property property;

    @NotBlank
    @Column(length = 20)
    @Builder.Default
    private String status = "INACTIVE"; // ACTIVE, INACTIVE

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "INACTIVE";
        }
    }
}
