package com.spinrent.spinrentbackend.repository;

import com.spinrent.spinrentbackend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review,Long> {
    List<Review> findAllByProductAdId(Long id);
}
