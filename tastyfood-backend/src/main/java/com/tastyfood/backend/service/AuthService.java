package com.tastyfood.backend.service;

import com.tastyfood.backend.model.LoginCredentials;
import com.tastyfood.backend.model.Staff;
import com.tastyfood.backend.repository.LoginCredentialsRepository;
import com.tastyfood.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private LoginCredentialsRepository loginCredentialsRepository;

    @Autowired
    private StaffRepository staffRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<Map<String, Object>> authenticate(String username, String password) {
        Optional<LoginCredentials> credentialsOpt = loginCredentialsRepository.findByUsername(username);

        if (credentialsOpt.isPresent()) {
            LoginCredentials credentials = credentialsOpt.get();
            if (passwordEncoder.matches(password, credentials.getPassword())) {
                Map<String, Object> authData = new HashMap<>();
                authData.put("username", credentials.getUsername());
                authData.put("userType", credentials.getUserType());
                authData.put("firstTimeLogin", credentials.getFirstTimeLogin());

                // If user is a staff member (not admin), retrieve their status
                if (!"admin".equals(credentials.getUserType())) {
                    Optional<Staff> staffOpt = staffRepository.findByUsername(username);
                    if (staffOpt.isPresent()) {
                        authData.put("status", staffOpt.get().getStatus());
                    }
                }

                return Optional.of(authData);
            }
        }

        return Optional.empty();
    }

    public boolean changePassword(String username, String oldPassword, String newPassword) {
        Optional<LoginCredentials> credentialsOpt = loginCredentialsRepository.findByUsername(username);

        if (credentialsOpt.isPresent()) {
            LoginCredentials credentials = credentialsOpt.get();

            if (passwordEncoder.matches(oldPassword, credentials.getPassword())) {
                credentials.setPassword(passwordEncoder.encode(newPassword));
                credentials.setFirstTimeLogin(false);
                loginCredentialsRepository.save(credentials);
                return true;
            }
        }

        return false;
    }

    public String hashPassword(String plainTextPassword) {
        return passwordEncoder.encode(plainTextPassword);
    }
}
