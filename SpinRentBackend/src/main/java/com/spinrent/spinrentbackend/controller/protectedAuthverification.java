package com.spinrent.spinrentbackend.controller;

import com.spinrent.spinrentbackend.entity.ProductAd;
import com.spinrent.spinrentbackend.entity.User;
import com.spinrent.spinrentbackend.repository.ProductAdRepo;
import com.spinrent.spinrentbackend.repository.UserRepository;
import com.spinrent.spinrentbackend.services.authentication.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/user")
public class protectedAuthverification {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductAdRepo productAdRepo;

    @Autowired
    private AuthService authService;

    @GetMapping("/signin")
    public ResponseEntity<?> signIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String userId = authentication.getName(); // This is what you set in your filter: the Clerk user ID
            return ResponseEntity.ok("User signed in: " + userId);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }

    @GetMapping("/userdetails")
    public  ResponseEntity<?> getUserDetails(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            try {
                Optional<User> user = userRepository.findByClerkId(authentication.getName());
                return ResponseEntity.ok(user.get());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }
    @GetMapping("/userdetails/{id}")
    public  ResponseEntity<?> getUserdetailsByproductId(@PathVariable Long id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       if (authentication != null && authentication.isAuthenticated()) {
        try {
            Optional<ProductAd> byId = productAdRepo.findById(id);
            return ResponseEntity.ok(byId.get().getUser().getUserDto());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
       }
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }

    @PutMapping("/updateuserdetails/{id}")
    public ResponseEntity<?> updateUserDetails(@RequestBody Map<String, String> payload, @PathVariable Long id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.isAuthenticated()){
            try {
                boolean b = authService.updateUser(payload, id);
                if(b){
                    return new ResponseEntity<>("user updated successfully",HttpStatus.OK);
                }
            }catch (Exception e){
                return new ResponseEntity<>("Error in updating user details",HttpStatus.NOT_FOUND);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }
}
