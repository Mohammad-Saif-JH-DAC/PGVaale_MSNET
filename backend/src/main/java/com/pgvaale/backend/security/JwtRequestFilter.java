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
<<<<<<< HEAD
    
    @Autowired
    private JwtUtil jwtUtil;
    
=======

    @Autowired
    private JwtUtil jwtUtil;

>>>>>>> 64db5fd0e771ea077e5568f059af2483eed5571f
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
<<<<<<< HEAD
        
        // Log the request for debugging
        System.out.println("JWT Filter - Request: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("Authorization Header: " + request.getHeader("Authorization"));
        
=======

        String path = request.getRequestURI();

        // ✅ Skip JWT check for public endpoints
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            chain.doFilter(request, response);
            return;
        }

>>>>>>> 64db5fd0e771ea077e5568f059af2483eed5571f
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
            }
        } else {
            System.out.println("No valid Bearer token found in Authorization header");
        }

        // If username is extracted and no authentication exists in context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
<<<<<<< HEAD
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
                System.err.println("Error loading user details or validating token: " + e.getMessage());
                e.printStackTrace();
=======
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
>>>>>>> 64db5fd0e771ea077e5568f059af2483eed5571f
            }
        } else {
            System.out.println("No username extracted or authentication already exists");
        }
<<<<<<< HEAD
        
        System.out.println("Continuing filter chain...");
        chain.doFilter(request, response);
    }
}
=======

        chain.doFilter(request, response);
    }
}
>>>>>>> 64db5fd0e771ea077e5568f059af2483eed5571f
