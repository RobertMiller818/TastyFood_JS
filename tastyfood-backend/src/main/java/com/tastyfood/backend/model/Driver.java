package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "Driver")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DriverID")
    private Integer driverId;

    @Column(name = "FirstName", length = 64)
    private String firstName;

    @Column(name = "LastName", length = 64)
    private String lastName;

    @Column(name = "EmploymentStatus")
    private Boolean employmentStatus;

    @Column(name = "AvailabilityStatus")
    private Boolean availabilityStatus;

    @Column(name = "Status", length = 20)
    private String status;

    @Column(name = "HiredDate")
    private LocalDate hiredDate;
}
