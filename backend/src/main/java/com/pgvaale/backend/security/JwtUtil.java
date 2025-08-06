package com.pgvaale.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // ✅ Secure 256-bit base64 encoded key (DO NOT expose in production)
    private static final String SECRET_STRING = "Wv3mRZ+bc5P69ZUI/epDWrKhfNRti/fvEbhN0v2NMWs=";

    // Decode the key and create SecretKey
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_STRING));
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            System.err.println("Error extracting username from token: " + e.getMessage());
            return null;
        }
    }

    public Long extractUserId(String token) {
        try {
            return extractClaim(token, claims -> {
                Object userIdObj = claims.get("userId");
                if (userIdObj instanceof Integer) {
                    return ((Integer) userIdObj).longValue();
                } else if (userIdObj instanceof Long) {
                    return (Long) userIdObj;
                }
                return null;
            });
        } catch (Exception e) {
            System.err.println("Error extracting user ID from token: " + e.getMessage());
            return null;
        }
    }

    public Date extractExpiration(String token) {
        try {
            return extractClaim(token, Claims::getExpiration);
        } catch (Exception e) {
            System.err.println("Error extracting expiration from token: " + e.getMessage());
            return null;
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        if (claims != null) {
            return claimsResolver.apply(claims);
        }
        return null;
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.err.println("Error parsing JWT: " + e.getMessage());
            return null;
        }
    }

    private Boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration == null || expiration.before(new Date());
    }

    public String generateToken(String username, String role) {
        return generateToken(username, role, null);
    }

    public String generateToken(String username, String role, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        if (role != null && !role.isEmpty()) {
            claims.put("role", role);
        }
        if (userId != null) {
            claims.put("userId", userId);
        }
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        try {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(subject)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            System.err.println("Error creating JWT: " + e.getMessage());
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    public Boolean validateToken(String token, String username) {
        try {
            final String extractedUsername = extractUsername(token);
            return (extractedUsername != null && extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (Exception e) {
            System.err.println("Error validating token: " + e.getMessage());
            return false;
        }
    }
}
