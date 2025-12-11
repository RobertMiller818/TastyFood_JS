package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StaffID")
    private Integer staffId;

    @Column(name = "FirstName", length = 64)
    private String firstName;

    @Column(name = "LastName", length = 64)
    private String lastName;

    @Column(name = "EmailAddress", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "Username", length = 64)
    private String username;

    @Column(name = "Status", length = 20)
    private String status;

    @Column(name = "HiredDate")
    private LocalDate hiredDate;
}
