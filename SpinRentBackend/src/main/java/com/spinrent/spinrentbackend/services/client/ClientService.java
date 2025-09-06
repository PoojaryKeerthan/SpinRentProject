package com.spinrent.spinrentbackend.services.client;

import com.spinrent.spinrentbackend.dto.ProductDto;
import com.spinrent.spinrentbackend.dto.ReservationDto;
import com.spinrent.spinrentbackend.dto.ReviewDto;
import com.spinrent.spinrentbackend.entity.ProductAd;
import com.spinrent.spinrentbackend.entity.Reservation;
import com.spinrent.spinrentbackend.entity.Review;
import com.spinrent.spinrentbackend.entity.User;
import com.spinrent.spinrentbackend.enums.ResservationStatus;
import com.spinrent.spinrentbackend.enums.ReviewStatus;
import com.spinrent.spinrentbackend.repository.ProductAdRepo;
import com.spinrent.spinrentbackend.repository.ReservationRepo;
import com.spinrent.spinrentbackend.repository.ReviewRepo;
import com.spinrent.spinrentbackend.repository.UserRepository;
import com.spinrent.spinrentbackend.services.emailServide.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ClientService {

    @Autowired
    private ProductAdRepo productAdRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private EmailService emailService;

    public List<ProductDto> getAllads() {
        try {
            List<ProductDto> products = productAdRepo.findAll().stream().map(ProductAd::getProductdto).toList();
            return products;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public List<ProductDto> searchProductByName(String name) {
        return productAdRepo.findAllByProductNameContaining(name).stream().map(ProductAd::getProductdto).toList();
    }

    public boolean bookService(ReservationDto reservationDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<ProductAd> productAd = productAdRepo.findById(reservationDto.getProductId());
        Optional<User> optionalUser = userRepository.findByClerkId(authentication.getName());
        if(productAd.isPresent() && optionalUser.isPresent()){
            Reservation reservation = new Reservation();

            reservation.setStartDate(reservationDto.getStartDate());
            reservation.setEndDate(reservationDto.getEndDate());
            reservation.setDuration(reservationDto.getDuration());
            reservation.setTotalPrice(reservationDto.getTotalPrice());
            reservation.setResservationStatus(ResservationStatus.PENDING);
            reservation.setBorrower(optionalUser.get());
            reservation.setProduct(productAd.get());
            reservation.setProvider(productAd.get().getUser());
            reservation.setReviewStatus(ReviewStatus.FALSE);

            Reservation save = reservationRepo.save(reservation);

            try {
                emailService.sendBookingEmail(productAd.get().getUser().getEmail(),
                        productAd.get().getProductName(),
                        optionalUser.get().getName(),
                        reservationDto.getStartDate().toString(),
                        reservationDto.getEndDate().toString());
            } catch (Exception e) {
               log.error("error in sending mail"+e);
            }

            return true;
        }
        return false;
    }

    public List<ReservationDto> getAllBorrowerBookedProducts(Long id){
        return reservationRepo.findAllByBorrowerId(id).stream().map(Reservation::getReservationDto).collect(Collectors.toList());
    }



    public Boolean giveReview(ReviewDto reviewDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> optionalUser = userRepository.findByClerkId(authentication.getName());
        Optional<Reservation> optionalReservation = reservationRepo.findById(reviewDto.getBookId());
        if(optionalReservation.isPresent() && optionalUser.isPresent()){
            Review review = new Review();
            review.setReviewDate(new Date());
            review.setReview(reviewDto.getReview());
            review.setRating(reviewDto.getRating());
            review.setUser(optionalUser.get());
            review.setProductAd(optionalReservation.get().getProduct());

            reviewRepo.save(review);
            Reservation booking = optionalReservation.get();
            booking.setReviewStatus(ReviewStatus.TRUE);

            reservationRepo.save(booking);
            return true;

        }
        return false;

    }



}