package com.spinrent.spinrentbackend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class ReviewDto {

    private Long id;

    private Date reviewDate;

    private String review;

    private Long rating;

    private Long userId;

    private Long productId;

    private String clientName;

    private String productName;

    private Long bookId;
}
