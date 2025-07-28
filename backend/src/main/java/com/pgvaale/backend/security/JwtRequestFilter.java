package com.pgvaale.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("JWT Filter - " + method + " " + path);
        System.out.println("Authorization Header: " + request.getHeader("Authorization"));

        // Allow unauthenticated access to public auth routes
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            chain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("Extracted username: " + username);
            } catch (Exception e) {
                System.err.println("Error extracting username: " + e.getMessage());
            }
        } else {
            System.out.println("No valid Bearer token found.");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Extract role from token
                String role = jwtUtil.extractClaim(jwt, claims -> (String) claims.get("role"));
                System.out.println("Extracted role: " + role);

                // Create authorities and set authentication
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null,
                        authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authentication successful for user: " + username);

            } catch (Exception e) {
                System.err.println("JWT validation/authentication failed: " + e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}
