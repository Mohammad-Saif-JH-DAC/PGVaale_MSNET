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

        // List of public paths
        if (isPublicPath(path)) {
            System.out.println("Allowing public access to: " + path);
            chain.doFilter(request, response);
            return;
        }

        // Allow unauthenticated access to public auth routes
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")
                || path.startsWith("/api/user/pgs")) {
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

                if (role == null || role.isEmpty()) {
                    System.err.println("No role found in JWT token");
                    chain.doFilter(request, response);
                    return;
                }

                // Create authorities and set authentication
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null,
                        authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authentication successful for user: " + username + " with role: " + role);

            } catch (Exception e) {
                System.err.println("JWT validation/authentication failed: " + e.getMessage());
            }
        } else if (username == null) {
            System.out.println("No username extracted from JWT token");
        } else {
            System.out.println("User already authenticated: " + username);
        }

        chain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/api/auth/login") ||
                path.startsWith("/api/auth/register") ||
                path.startsWith("/api/user/register") ||
                path.startsWith("/api/user/login") ||
                // path.startsWith("/api/user/pgs") ||
                path.startsWith("/api/user/dashboard") ||
                path.startsWith("/api/pg/all") ||
                path.startsWith("/api/pg/region") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs");
    }
}
