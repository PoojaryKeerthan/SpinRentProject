package com.spinrent.spinrentbackend.dto;

import com.spinrent.spinrentbackend.enums.UserRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {


    private String clerkId;
    private String email;
    private String name;
    private UserRole role;
    private String phoneNumber;
    private String addressLine1;
    private String city;
    private String state;
    private String postalCode;
    private String country;


}
