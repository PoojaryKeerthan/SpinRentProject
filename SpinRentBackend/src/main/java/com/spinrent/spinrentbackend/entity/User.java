package com.spinrent.spinrentbackend.entity;

import com.spinrent.spinrentbackend.dto.UserDto;
import com.spinrent.spinrentbackend.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="users")
@Data

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String clerkId;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    private String phoneNumber;
    private String addressLine1;
    private String city;
    private String state;
    private String postalCode;
    private String country;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    public UserDto getUserDto(){
        UserDto userDto = new UserDto();
        userDto.setEmail(email);
        userDto.setName(name);
        userDto.setPhoneNumber(phoneNumber);
        userDto.setAddressLine1(addressLine1);
        userDto.setCity(city);
        userDto.setState(state);
        userDto.setPostalCode(postalCode);
        userDto.setCountry(country);

        return userDto;
    }
}
