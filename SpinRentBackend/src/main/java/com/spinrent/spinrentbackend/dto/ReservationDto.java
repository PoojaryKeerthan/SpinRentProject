package com.spinrent.spinrentbackend.dto;

import com.spinrent.spinrentbackend.enums.ResservationStatus;
import com.spinrent.spinrentbackend.enums.ReviewStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class ReservationDto {

    private Long id;

    private LocalDate startDate;

    private LocalDate endDate;

    private Long duration;

    private Long totalPrice;

    private String productName;

    private ResservationStatus resservationStatus;

    private ReviewStatus reviewStatus;

    private Long borrowerId;

    private String borrowerName;

    private Long providerId;

    private Long productId;
}


