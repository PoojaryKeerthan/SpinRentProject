package com.spinrent.spinrentbackend.security;

import com.nimbusds.jwt.JWTClaimsSet;
import com.spinrent.spinrentbackend.cache.UserCache;
import com.spinrent.spinrentbackend.entity.User;
import com.spinrent.spinrentbackend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class ClerkJwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private ClerkTokenVerifier clerkTokenVerifier;

    @Autowired
    private UserCache userCache;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ⛔ Skip the filter for public endpoints
        if (path.startsWith("/api/v1/public/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                JWTClaimsSet claimsSet = clerkTokenVerifier.verify(token);
                String clerkId = claimsSet.getSubject();

                UserDetails userDetails = userCache.get(clerkId);

                if (userDetails == null) {
                    // Not in cache — do DB lookup
                    Optional<User> userOpt = userRepository.findByClerkId(clerkId);
                    if (userOpt.isEmpty()) {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                        return;
                    }

                    User user = userOpt.get();

                    // Convert to UserDetails (or use your own implementation)
                    userDetails = org.springframework.security.core.userdetails.User
                            .withUsername(clerkId)
                            .password("") // no password needed
                            .roles(user.getRole().name()) // Role from your DB
                            .build();
                    userCache.put(clerkId, userDetails); // ✅ Cache it
                }

                // Set Spring Security Context
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Clerk JWT");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
