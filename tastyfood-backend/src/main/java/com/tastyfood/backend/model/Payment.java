package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "Payment")
@IdClass(PaymentId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "address")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentID")
    private Integer paymentId;

    @Id
    @Column(name = "CreditCardNo")
    private Long creditCardNo;

    @Column(name = "CardType", length = 64)
    private String cardType;

    @Column(name = "Name", length = 64)
    private String name;

    @Column(name = "Expiration")
    private LocalDate expiration;

    @Column(name = "SecurityCode", length = 3)
    private String securityCode;

    @ManyToOne
    @JoinColumn(name = "AddressID")
    private Address address;
}
