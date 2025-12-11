package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Rewards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"address", "payment"})
public class Rewards {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RewardsNo")
    private Integer rewardsNo;

    @ManyToOne
    @JoinColumn(name = "AddressID")
    private Address address;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "PaymentID", referencedColumnName = "PaymentID"),
        @JoinColumn(name = "CreditCardNo", referencedColumnName = "CreditCardNo")
    })
    private Payment payment;

    @Column(name = "FirstName", length = 64)
    private String firstName;

    @Column(name = "LastName", length = 64)
    private String lastName;

    @Column(name = "OrderCount")
    private Integer orderCount;

    @Column(name = "Approved")
    private Boolean approved;
}
