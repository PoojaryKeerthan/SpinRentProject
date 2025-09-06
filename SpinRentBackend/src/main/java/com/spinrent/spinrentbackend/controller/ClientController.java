package com.spinrent.spinrentbackend.controller;

import com.spinrent.spinrentbackend.dto.ProductDto;
import com.spinrent.spinrentbackend.dto.ReservationDto;
import com.spinrent.spinrentbackend.dto.ReviewDto;
import com.spinrent.spinrentbackend.entity.Reservation;
import com.spinrent.spinrentbackend.entity.Review;
import com.spinrent.spinrentbackend.repository.ReservationRepo;
import com.spinrent.spinrentbackend.repository.ReviewRepo;
import com.spinrent.spinrentbackend.services.client.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/client")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ReservationRepo reservationRepo;

    //notimplemented
    @GetMapping("/getallproducts")
    public ResponseEntity<?> getAllproducts(){
        try {
            List<ProductDto> allads = clientService.getAllads();
            return new ResponseEntity<>(allads, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching products"+e, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getproductbyname/{name}")
    public ResponseEntity<?> searchProductByName(@PathVariable String name){
        try {
            List<ProductDto> product = clientService.searchProductByName(name);
            return new ResponseEntity<>(product,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("No items found",HttpStatus.NOT_FOUND);
        }

    }

    @PostMapping("/bookmyorder")
    public ResponseEntity<?> bookService(@RequestBody ReservationDto reservationDto){
        boolean success = clientService.bookService(reservationDto);
        if(success){
            return new ResponseEntity<>("Order successfully completed",HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Error in ordering",HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getproductsbyborrowid/{id}")
    public ResponseEntity<?> getproductsbyborrowerid(@PathVariable  Long id){
        try {
            List<ReservationDto> allBorrowerBookedProducts = clientService.getAllBorrowerBookedProducts(id);
            return new ResponseEntity<>(allBorrowerBookedProducts,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching",HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/givereview")
    public ResponseEntity<?> giveReview(@RequestBody ReviewDto reviewDto){
        try {
            Boolean b = clientService.giveReview(reviewDto);
            return new ResponseEntity<>("Review updated successfully",HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error in giving review",HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getreview/{id}")
    public ResponseEntity<?> getReviewsOfProduct(@PathVariable Long id){
        try {
            List<ReviewDto> collect = reviewRepo.findAllByProductAdId(id).stream().map(Review::getReviews).collect(Collectors.toList());
            return new ResponseEntity<>(collect,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error in reviews",HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getreservationbyproductid/{id}")
    public ResponseEntity<?> getreservationbyproductid(@PathVariable Long id){
        try {
            List<Map<String, LocalDate>> dates = reservationRepo.findAllByProductId(id)
                    .stream()
                    .map(r -> Map.of("startDate", r.getStartDate(), "endDate", r.getEndDate()))
                    .collect(Collectors.toList());
            return new ResponseEntity<>(dates,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error in fetching dates",HttpStatus.NOT_FOUND);
        }


    }


}
