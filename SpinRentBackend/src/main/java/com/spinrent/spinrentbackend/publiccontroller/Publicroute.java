package com.spinrent.spinrentbackend.publiccontroller;

import com.nimbusds.jwt.JWTClaimsSet;
import com.spinrent.spinrentbackend.dto.ReservationDto;
import com.spinrent.spinrentbackend.dto.UserDto;
import com.spinrent.spinrentbackend.entity.ProductAd;
import com.spinrent.spinrentbackend.entity.Reservation;
import com.spinrent.spinrentbackend.entity.User;
import com.spinrent.spinrentbackend.enums.UserRole;
import com.spinrent.spinrentbackend.repository.ProductAdRepo;
import com.spinrent.spinrentbackend.security.ClerkTokenVerifier;
import com.spinrent.spinrentbackend.services.authentication.AuthService;
import com.spinrent.spinrentbackend.services.client.ClientService;
import com.spinrent.spinrentbackend.services.provider.Productadservice;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/public")
public class Publicroute {

    @Autowired
    private ClerkTokenVerifier clerkTokenVerifier;

    @Autowired
    private AuthService authService;

    @Autowired
    private Productadservice productadservice;

    @Autowired
    private ProductAdRepo productAdRepo;

    @Autowired
    private ClientService clientService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUpUser(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            JWTClaimsSet claims = clerkTokenVerifier.verify(token);


            String role = payload.get("role");
            String phoneNumber = payload.get("phoneNumber");
            String addressLine1 = payload.get("addressLine1");
            String city = payload.get("city");
            String state = payload.get("state");
            String postalCode = payload.get("postalCode");
            String country = payload.get("country");
            if (role == null || role.isEmpty()) {
                return ResponseEntity.badRequest().body("Missing role in request body");
            }

            UserDto user = new UserDto();
            Map<String, Object> response = new HashMap<>(claims.toJSONObject());
            user.setClerkId((String)response.get("sub"));
            user.setEmail((String)response.get("email"));
            user.setName((String)response.get("name"));
            user.setPhoneNumber(phoneNumber);
            user.setAddressLine1(addressLine1);
            user.setCity(city);
            user.setState(state);
            user.setPostalCode(postalCode);
            user.setCountry(country);

            try {
                user.setRole(UserRole.valueOf(role.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid role: " + role);
            }

            ResponseEntity<?> responseEntity = authService.saveUser(user);
            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok(responseEntity.getBody());
            } else {
                return ResponseEntity.status(responseEntity.getStatusCode()).body(responseEntity.getBody());
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token: " + e.getMessage());
        }
    }

    @GetMapping("/getads")
    public ResponseEntity<?> getProducts(){
        return ResponseEntity.ok(productadservice.getAllAds());
    }



}
