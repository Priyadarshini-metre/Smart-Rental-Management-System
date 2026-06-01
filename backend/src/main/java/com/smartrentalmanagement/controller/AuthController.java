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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

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
        logger.info("=== Login Request Received ===");
        logger.info("Username: {}", loginRequest.getUsername());
        
        try {
            logger.info("Attempting authentication...");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            String username = loginRequest.getUsername();
            logger.info("Authentication successful for: {}", username);
            
            logger.info("Generating JWT token...");
            String jwt = jwtUtils.generateJwtToken(username);
            logger.info("JWT token generated successfully");

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(item -> item.getAuthority().replace("ROLE_", ""))
                    .orElse("USER");

            logger.info("Login successful for user: {} with role: {}", userDetails.getUsername(), role);

            AuthResponse authResponse = new AuthResponse(
                    jwt,
                    userDetails.getUsername(),
                    role,
                    userDetails.getFullName(),
                    userDetails.getEmail()
            );

            logger.info("Returning successful response");
            return ResponseEntity.ok(ApiResponse.success("Authentication successful", authResponse));
        } catch (BadCredentialsException e) {
            logger.warn("=== Bad Credentials ===");
            logger.warn("Message: {}", e.getMessage());
            throw e;
        } catch (DisabledException e) {
            logger.warn("=== Account Disabled ===");
            logger.warn("Message: {}", e.getMessage());
            throw e;
        } catch (LockedException e) {
            logger.warn("=== Account Locked ===");
            logger.warn("Message: {}", e.getMessage());
            throw e;
        } catch (UsernameNotFoundException e) {
            logger.warn("=== User Not Found ===");
            logger.warn("Message: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("=== Login Exception ===");
            logger.error("Exception Type: {}", e.getClass().getName());
            logger.error("Exception Message: {}", e.getMessage());
            logger.error("Stack trace:", e);
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        logger.info("=== Registration Request Received ===");
        logger.info("Username: {}", signUpRequest.getUsername());
        logger.info("Email: {}", signUpRequest.getEmail());
        logger.info("Full Name: {}", signUpRequest.getFullName());
        logger.info("Role: {}", signUpRequest.getRole());

        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                logger.warn("Username already exists: {}", signUpRequest.getUsername());
                throw new BadRequestException("Username is already taken!");
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                logger.warn("Email already exists: {}", signUpRequest.getEmail());
                throw new BadRequestException("Email is already in use!");
            }

            // Create new user's account
            Role userRole = Role.USER;
            if (signUpRequest.getRole() != null) {
                try {
                    userRole = Role.valueOf(signUpRequest.getRole().toUpperCase());
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid role provided: {}", signUpRequest.getRole());
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

            logger.info("Saving user to database...");
            userRepository.save(user);
            logger.info("User saved successfully with ID: {}", user.getId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully!", null));
        } catch (BadRequestException e) {
            logger.warn("=== Registration BadRequestException ===");
            logger.warn("Message: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("=== Registration Exception ===");
            logger.error("Exception Type: {}", e.getClass().getName());
            logger.error("Exception Message: {}", e.getMessage());
            logger.error("Stack trace:", e);
            throw e;
        }
    }
}
