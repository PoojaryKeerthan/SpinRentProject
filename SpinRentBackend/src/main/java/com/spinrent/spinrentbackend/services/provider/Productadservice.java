package com.spinrent.spinrentbackend.services.provider;

import com.spinrent.spinrentbackend.dto.ProductDto;
import com.spinrent.spinrentbackend.dto.ReservationDto;
import com.spinrent.spinrentbackend.entity.ProductAd;
import com.spinrent.spinrentbackend.entity.Reservation;
import com.spinrent.spinrentbackend.entity.User;
import com.spinrent.spinrentbackend.enums.ResservationStatus;
import com.spinrent.spinrentbackend.repository.ProductAdRepo;
import com.spinrent.spinrentbackend.repository.ReservationRepo;
import com.spinrent.spinrentbackend.repository.UserRepository;
import com.spinrent.spinrentbackend.services.emailServide.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class Productadservice {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductAdRepo productAdRepo;

    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private EmailService emailService;

    public boolean postProductAd(String userId, ProductDto productDto) throws IOException {
        Optional<User> optionalUser = userRepository.findByClerkId(userId);
        if(optionalUser.isPresent()){
            ProductAd productAd = new ProductAd();
            productAd.setProductName(productDto.getProductName());
            productAd.setDescription(productDto.getDescription());
            productAd.setImg(productDto.getImg().getBytes());
            productAd.setPrice(productDto.getPrice());
            productAd.setCategory(productDto.getCategory());
            productAd.setUser(optionalUser.get());

            productAdRepo.save(productAd);
            return true;
        }
        return false;
    }

    public List<ProductDto> getAllAds(String userId){
        return productAdRepo.findByUser_ClerkId(userId).stream().map(ProductAd::getProductdto).collect(Collectors.toList());
    }
    public List<ProductDto> getAllAds(){
        return productAdRepo.findAll().stream().map(ProductAd::getProductdto).collect(Collectors.toList());
    }
    
    public ProductDto getAdbyId(Long id){
        Optional<ProductAd> product = productAdRepo.findById(id);
        if(product.isPresent()){
            return product.get().getProductdto();
        }
        return null;
    }

    public boolean updateProductbyId(Long id,ProductDto productDto) throws IOException {
        Optional<ProductAd> product = productAdRepo.findById(id);
        if(product.isPresent()){
            ProductAd ad = product.get();

            ad.setProductName(productDto.getProductName());
            ad.setDescription(productDto.getDescription());
            ad.setPrice(productDto.getPrice());
            ad.setCategory(productDto.getCategory());
            if(productDto.getImg() != null){
                ad.setImg(productDto.getImg().getBytes());
            }
            productAdRepo.save(ad);
            return true;
        }else{
            return false;
        }
    }

    public boolean deleteProductbyId(Long id){
        Optional<ProductAd> product = productAdRepo.findById(id);
        if(product.isPresent()){
            productAdRepo.delete(product.get());
            return true;
        }else{
            return false;
        }
    }

    public List<ReservationDto> getProductsProvidedByUser(Long id){
        return reservationRepo.findAllByProviderId(id).stream().map(Reservation::getReservationDto).collect(Collectors.toList());
    }

    public boolean changeBookingStatus(Long bookingId,String status){
        Optional<Reservation> optionalReservation = reservationRepo.findById(bookingId);
        if(optionalReservation.isPresent()){
            Reservation existingReservation = optionalReservation.get();
            if(Objects.equals(status,"Approve")){
                existingReservation.setResservationStatus(ResservationStatus.APPROVED);
                try{
                    emailService.sendBookingAcceptedEmail(optionalReservation.get().getBorrower().getEmail(),
                            optionalReservation.get().getProduct().getProductName(),
                            optionalReservation.get().getProvider().getName(),
                            optionalReservation.get().getStartDate().toString(),
                            optionalReservation.get().getEndDate().toString()
                    );
                }catch (Exception e){
                    log.error("error in sending mail"+e);
                }
            }else{
                existingReservation.setResservationStatus(ResservationStatus.REJECTED);

                try{
                    emailService.sendBookingRejectedEmail(optionalReservation.get().getBorrower().getEmail(),
                            optionalReservation.get().getProduct().getProductName(),
                            optionalReservation.get().getProvider().getName(),
                            optionalReservation.get().getStartDate().toString(),
                            optionalReservation.get().getEndDate().toString());
                }catch (Exception e){
                    log.error("error in sending mail"+e);
                }
            }
            reservationRepo.save(existingReservation);

            return true;
        }
        return false;
    }

}
