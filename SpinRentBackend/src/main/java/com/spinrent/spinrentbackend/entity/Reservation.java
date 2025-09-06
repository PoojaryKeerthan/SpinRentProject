package com.spinrent.spinrentbackend.entity;

import com.spinrent.spinrentbackend.dto.ReservationDto;
import com.spinrent.spinrentbackend.enums.ResservationStatus;
import com.spinrent.spinrentbackend.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ResservationStatus resservationStatus;

    private ReviewStatus reviewStatus;

    private LocalDate startDate;
    private LocalDate endDate;
    private Long duration;
    private Long totalPrice;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "borrower_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User borrower;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "provider_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User provider;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "product_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ProductAd product;

    public ReservationDto getReservationDto(){
        ReservationDto reservationDto = new ReservationDto();

        reservationDto.setId(id);
        reservationDto.setProductName(product.getProductName());
        reservationDto.setStartDate(startDate);
        reservationDto.setEndDate(endDate);
        reservationDto.setDuration(duration);
        reservationDto.setTotalPrice(totalPrice);
        reservationDto.setResservationStatus(resservationStatus);
        reservationDto.setReviewStatus(reviewStatus);
        reservationDto.setProductId(product.getId());
        reservationDto.setProviderId(provider.getId());
        reservationDto.setBorrowerName(borrower.getName());

        return reservationDto;
    }
}
