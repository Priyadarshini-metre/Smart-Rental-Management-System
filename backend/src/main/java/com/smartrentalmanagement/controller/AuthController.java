package com.smartrentalmanagement.controller;

import com.smartrentalmanagement.dto.ApiResponse;
import com.smartrentalmanagement.dto.AuthResponse;
import com.smartrentalmanagement.dto.LoginRequest;
import com.smartrentalmanagement.dto.RegisterRequest;
import com.smartrentalmanagement.entity.Role;
import com.smartrentalmanagement.entity.User;
import com.smartrentalmanagement.exception.BadRequestException;
import com.smartrentalmanagement.repository.UserRepository;
import com.smartrentalmanagement.security.JwtUtils;
import com.smartrentalmanagement.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("=== Login Request Received ===");
        System.out.println("Username: " + loginRequest.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            String username = loginRequest.getUsername();
            System.out.println("Authentication successful for: " + username);
            
            String jwt = jwtUtils.generateJwtToken(username);
            System.out.println("JWT token generated successfully");

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(item -> item.getAuthority().replace("ROLE_", ""))
                    .orElse("USER");

            System.out.println("Login successful for user: " + userDetails.getUsername() + " with role: " + role);

            AuthResponse authResponse = new AuthResponse(
                    jwt,
                    userDetails.getUsername(),
                    role,
                    userDetails.getFullName(),
                    userDetails.getEmail()
            );

            return ResponseEntity.ok(ApiResponse.success("Authentication successful", authResponse));
        } catch (Exception e) {
            System.out.println("=== Login Exception ===");
            System.out.println("Exception Type: " + e.getClass().getName());
            System.out.println("Exception Message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        System.out.println("=== Registration Request Received ===");
        System.out.println("Username: " + signUpRequest.getUsername());
        System.out.println("Email: " + signUpRequest.getEmail());
        System.out.println("Full Name: " + signUpRequest.getFullName());
        System.out.println("Role: " + signUpRequest.getRole());

        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                System.out.println("Username already exists: " + signUpRequest.getUsername());
                throw new BadRequestException("Username is already taken!");
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                System.out.println("Email already exists: " + signUpRequest.getEmail());
                throw new BadRequestException("Email is already in use!");
            }

            // Create new user's account
            Role userRole = Role.USER;
            if (signUpRequest.getRole() != null) {
                try {
                    userRole = Role.valueOf(signUpRequest.getRole().toUpperCase());
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid role provided: " + signUpRequest.getRole());
                    throw new BadRequestException("Invalid role provided. Choose ADMIN or USER.");
                }
            }

            User user = User.builder()
                    .username(signUpRequest.getUsername())
                    .email(signUpRequest.getEmail())
                    .password(encoder.encode(signUpRequest.getPassword()))
                    .fullName(signUpRequest.getFullName())
                    .role(userRole)
                    .build();

            System.out.println("Saving user to database...");
            userRepository.save(user);
            System.out.println("User saved successfully with ID: " + user.getId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully!", null));
        } catch (BadRequestException e) {
            System.out.println("=== Registration BadRequestException ===");
            System.out.println("Message: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("=== Registration Exception ===");
            System.out.println("Exception Type: " + e.getClass().getName());
            System.out.println("Exception Message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
