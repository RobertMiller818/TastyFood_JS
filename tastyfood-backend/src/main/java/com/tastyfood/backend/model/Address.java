package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Address")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @Column(name = "AddressID")
    private Integer addressId;

    @Column(name = "StreetNo", length = 16)
    private String streetNo;

    @Column(name = "StreetName", length = 64)
    private String streetName;

    @Column(name = "City", length = 64)
    private String city;

    @Column(name = "State", length = 64)
    private String state;

    @Column(name = "ZipCode", length = 10)
    private String zipCode;

    @Column(name = "Delivery")
    private Boolean delivery;

    @Column(name = "Billing")
    private Boolean billing;
}
