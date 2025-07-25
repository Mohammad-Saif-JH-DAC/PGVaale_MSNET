package com.pgvaale.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Log the request for debugging
        System.out.println("JWT Filter - Request: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("Authorization Header: " + request.getHeader("Authorization"));

        // ✅ Skip JWT check for public authentication endpoints
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            System.out.println("Skipping JWT filter for public auth endpoint: " + path);
            chain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // Check if Authorization header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("Extracted username from JWT: " + username);
            } catch (Exception e) {
                System.err.println("Error extracting username from JWT: " + e.getMessage());
                // Optionally log the full stack trace for debugging: e.printStackTrace();
            }
        } else {
            System.out.println("No valid Bearer token found in Authorization header for path: " + path);
        }

        // If username is extracted and no authentication exists in context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                System.out.println("User details loaded for: " + username);

                // Validate token - Pass username string (as your JwtUtil expects)
                if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentication set for user: " + username);
                } else {
                    System.out.println("JWT token validation failed for user: " + username);
                }
            } catch (Exception e) {
                System.err.println("Error loading user details or validating token for user: " + username + ". Error: " + e.getMessage());
                // Optionally log the full stack trace for debugging: e.printStackTrace();
            }
        } else {
            System.out.println("No username extracted or authentication already exists for path: " + path);
        }

        System.out.println("Continuing filter chain for path: " + path);
        chain.doFilter(request, response);
    }
}