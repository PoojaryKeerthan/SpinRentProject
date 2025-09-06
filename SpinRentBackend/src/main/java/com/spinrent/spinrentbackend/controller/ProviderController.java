package com.spinrent.spinrentbackend.controller;

import com.spinrent.spinrentbackend.dto.ProductDto;
import com.spinrent.spinrentbackend.dto.ReservationDto;
import com.spinrent.spinrentbackend.entity.ProductAd;
import com.spinrent.spinrentbackend.services.provider.Productadservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/provider")
public class ProviderController {

    @Autowired
    private Productadservice productadservice;

    @PostMapping("/postproduct")
    public ResponseEntity<?> postAd(@ModelAttribute ProductDto productDto) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            boolean b = productadservice.postProductAd(authentication.getName(), productDto);
            if (b) {
                return ResponseEntity.status(HttpStatus.OK).body("product added successfully");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/getads")
    public ResponseEntity<?> getProductsbyuser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productadservice.getAllAds(authentication.getName()));
    }

    @GetMapping("/getadbyid/{id}")
    public ResponseEntity<?> getproductById(@PathVariable Long id) {
        try {
            ProductDto product = productadservice.getAdbyId(id);
            if (product != null) {
                return ResponseEntity.ok(product);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>("Item not found", HttpStatus.NOT_FOUND);
    }

    @PutMapping("/updateproduct/{id}")
    public ResponseEntity<?> updateProductbyId(@PathVariable Long id, @ModelAttribute ProductDto productDto) {
        try {
            boolean b = productadservice.updateProductbyId(id, productDto);
            if (b) return new ResponseEntity<>("product updated  successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error updating product" + e, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Error updating product", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteproduct/{id}")
    public ResponseEntity<?> deleteProductById(@PathVariable Long id) {
        try {
            boolean b = productadservice.deleteProductbyId(id);
            if (b) return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error in deleting product", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Error in deleting product", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/getproductsbyprovider/{id}")
    public ResponseEntity<?> getproductsbyproviderid(@PathVariable  Long id){
        try {
            List<ReservationDto> allBorrowerBookedProducts = productadservice.getProductsProvidedByUser(id);
            return new ResponseEntity<>(allBorrowerBookedProducts,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching",HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/booking/{bookingId}/{status}")
    public ResponseEntity<?> changebookingStatus(@PathVariable Long bookingId,@PathVariable String status){
        boolean success = productadservice.changeBookingStatus(bookingId, status);
        if(success) return new ResponseEntity<>("Order Approved Succefully",HttpStatus.OK);
        return new ResponseEntity<>("Error in updating",HttpStatus.NOT_FOUND);
    }

}
