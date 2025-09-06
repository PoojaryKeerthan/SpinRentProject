package com.spinrent.spinrentbackend.services.authentication;

import com.spinrent.spinrentbackend.dto.UserDto;
import com.spinrent.spinrentbackend.entity.User;
import com.spinrent.spinrentbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> saveUser(UserDto user){
        try {
           User userData = new User();
           userData.setClerkId(user.getClerkId());
           userData.setEmail(user.getEmail());
           userData.setName(user.getName());
           userData.setRole(user.getRole());
           userData.setPhoneNumber(user.getPhoneNumber());
           userData.setAddressLine1(user.getAddressLine1());
           userData.setCity(user.getCity());
           userData.setState(user.getState());
           userData.setPostalCode(user.getPostalCode());
           userData.setCountry(user.getCountry());

           userRepository.save(userData);
           return ResponseEntity.ok("User saved successfully.");
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save user: " + e.getMessage());
        }
    }

    public boolean updateUser(Map<String, String> payload,Long id){
        Optional<User> user = userRepository.findById(id);
        if(user.isPresent()){
            String name = payload.get("name");
            String addressLine1 = payload.get("addressLine1");
            String city = payload.get("city");
            String state = payload.get("state");
            String postalCode = payload.get("postalCode");
            String country = payload.get("country");
            String phoneNumber = payload.get("phoneNumber");

            User newUser = user.get();
            newUser.setName(name);
            newUser.setAddressLine1(addressLine1);
            newUser.setCity(city);
            newUser.setState(state);
            newUser.setPostalCode(postalCode);
            newUser.setCountry(country);
            newUser.setPhoneNumber(phoneNumber);

            userRepository.save(newUser);
            return true;
        }
        return false;
    }


}
