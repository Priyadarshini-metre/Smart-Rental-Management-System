package com.smartrentalmanagement.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${smartrental.app.jwtSecret}")
    private String jwtSecret;

    @Value("${smartrental.app.jwtExpirationMs}")
    private long jwtExpirationMs;

    private Key key() {
        // Try to decode as BASE64 first, if that fails use the raw string
        try {
            logger.info("Attempting to decode JWT_SECRET as BASE64...");
            Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
            logger.info("JWT_SECRET decoded successfully as BASE64");
            return key;
        } catch (IllegalArgumentException e) {
            // If BASE64 decoding fails, use the raw string bytes
            logger.warn("JWT_SECRET is not valid BASE64, using raw string. Error: {}", e.getMessage());
            return Keys.hmacShaKeyFor(jwtSecret.getBytes());
        } catch (Exception e) {
            logger.error("Failed to create JWT signing key. Exception: {}", e.getMessage(), e);
            throw new RuntimeException("Invalid JWT secret configuration", e);
        }
    }

    public String generateJwtToken(String username) {
        logger.info("Generating JWT token for user: {}", username);
        try {
            String token = Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                    .signWith(key(), SignatureAlgorithm.HS256)
                    .compact();
            logger.info("JWT token generated successfully for user: {}", username);
            return token;
        } catch (Exception e) {
            logger.error("Failed to generate JWT token for user: {}. Exception: {}", username, e.getMessage(), e);
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
