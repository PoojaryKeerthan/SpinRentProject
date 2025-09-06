package com.spinrent.spinrentbackend.repository;

import com.spinrent.spinrentbackend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepo extends JpaRepository<Reservation,Long> {
    List<Reservation> findAllByProviderId(Long id);
    List<Reservation> findAllByBorrowerId(Long id);
    List<Reservation> findAllByProductId(Long productId);
}
