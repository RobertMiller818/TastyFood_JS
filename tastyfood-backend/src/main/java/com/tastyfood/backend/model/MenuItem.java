package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "MenuItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @Column(name = "ItemID")
    private Integer itemId;

    @Column(name = "ItemName", length = 64)
    private String itemName;

    @Column(name = "Category", length = 64)
    private String category;

    @Column(name = "Price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "Availability", length = 64)
    private String availability;
}
