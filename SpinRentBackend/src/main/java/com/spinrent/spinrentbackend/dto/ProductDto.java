package com.spinrent.spinrentbackend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductDto {
    private Long id;

    private String productName;

    private String description;

    private Double price;

    private MultipartFile img;

    private byte[] returnedImage;

    private String userId;

    private String userName;

    private String Category;
}
