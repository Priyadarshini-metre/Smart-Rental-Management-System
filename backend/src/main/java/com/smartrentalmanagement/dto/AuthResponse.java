package com.smartrentalmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String role;
    private String fullName;
    private String email;

    public AuthResponse(String token, String username, String role, String fullName, String email) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }
}
