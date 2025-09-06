package com.spinrent.spinrentbackend.entity;

import com.spinrent.spinrentbackend.dto.ProductDto;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "product_ads")
@Data
public class ProductAd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;

    private String description;

    private Double price;

    private String Category;

    @Lob
    @Column(columnDefinition = "Longblob")
    private byte[] img;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;


    public ProductDto getProductdto(){
        ProductDto productDto = new ProductDto();
        productDto.setId(id);
        productDto.setProductName(productName);
        productDto.setDescription(description);
        productDto.setPrice(price);
        productDto.setCategory(Category);
        productDto.setUserName(user.getName());
        productDto.setReturnedImage(img);

        return productDto;
    }
}
