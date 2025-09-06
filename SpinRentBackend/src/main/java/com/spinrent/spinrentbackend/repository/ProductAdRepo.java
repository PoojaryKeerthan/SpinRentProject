package com.spinrent.spinrentbackend.repository;

import com.spinrent.spinrentbackend.dto.ProductDto;
import com.spinrent.spinrentbackend.entity.ProductAd;
import com.spinrent.spinrentbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductAdRepo extends JpaRepository<ProductAd,Long> {
    List<ProductAd> findByUser_ClerkId(String clerkId);
    List<ProductAd> findAllByProductNameContaining(String name);
}
