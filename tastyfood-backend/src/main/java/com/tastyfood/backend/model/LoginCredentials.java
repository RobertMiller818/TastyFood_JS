package com.tastyfood.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "LoginCredentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginCredentials {

    @Id
    @Column(name = "Username", length = 64)
    private String username;

    @Column(name = "Password", length = 255)
    private String password;

    @Column(name = "UserType", length = 16)
    private String userType;

    @Column(name = "FirstTimeLogin")
    private Boolean firstTimeLogin;
}
