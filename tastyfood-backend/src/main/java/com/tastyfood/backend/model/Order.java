package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Customer_Order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"items", "rewards", "driver", "address", "payment"})
public class Order {

    @Id
    @Column(name = "OrderNo", length = 10)
    private String orderNo;

    @ManyToOne
    @JoinColumn(name = "RewardsNo")
    private Rewards rewards;

    @Column(name = "Subtotal", precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "Tip", precision = 10, scale = 2)
    private BigDecimal tip;

    @Column(name = "Total", precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "OrderDate")
    private LocalDate orderDate;

    @Column(name = "OrderTime")
    private LocalTime orderTime;

    @Column(name = "DeliveryDate")
    private LocalDate deliveryDate;

    @Column(name = "DeliveryTime")
    private LocalTime deliveryTime;

    @ManyToOne
    @JoinColumn(name = "DriverID")
    private Driver driver;

    @Column(name = "Driver_firstname", length = 64)
    private String driverFirstname;

    @Column(name = "Driver_lastname", length = 64)
    private String driverLastname;

    @ManyToOne
    @JoinColumn(name = "AddressID")
    private Address address;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "PaymentID", referencedColumnName = "PaymentID"),
        @JoinColumn(name = "CreditCardNo", referencedColumnName = "CreditCardNo")
    })
    private Payment payment;

    @Column(name = "DeliveryETA", precision = 10, scale = 0)
    private BigDecimal deliveryETA;

    @Column(name = "DeliveryStatus", length = 64)
    private String deliveryStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderLineItem> items = new ArrayList<>();

    // Helper method to add order items
    public void addItem(OrderLineItem item) {
        items.add(item);
        item.setOrder(this);
    }

    // Helper method to remove order items
    public void removeItem(OrderLineItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}
