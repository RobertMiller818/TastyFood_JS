package com.tastyfood.backend.controller;

import com.tastyfood.backend.model.LoginCredentials;
import com.tastyfood.backend.repository.LoginCredentialsRepository;
import com.tastyfood.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/login-credentials")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginCredentialsController {

    @Autowired
    private LoginCredentialsRepository loginCredentialsRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<LoginCredentials>> getAllLoginCredentials() {
        List<LoginCredentials> credentials = loginCredentialsRepository.findAll();
        return ResponseEntity.ok(credentials);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<LoginCredentials> getLoginCredentialsByUsername(@PathVariable String username) {
        Optional<LoginCredentials> credentials = loginCredentialsRepository.findByUsername(username);
        return credentials.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LoginCredentials> createLoginCredentials(@RequestBody LoginCredentials credentials) {
        // Hash the password before saving
        if (credentials.getPassword() != null && !credentials.getPassword().isEmpty()) {
            credentials.setPassword(authService.hashPassword(credentials.getPassword()));
        }

        LoginCredentials savedCredentials = loginCredentialsRepository.save(credentials);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCredentials);
    }

    @PutMapping("/{username}")
    public ResponseEntity<LoginCredentials> updateLoginCredentials(
            @PathVariable String username,
            @RequestBody LoginCredentials credentialsDetails) {
        Optional<LoginCredentials> existingCredentials = loginCredentialsRepository.findByUsername(username);

        if (existingCredentials.isPresent()) {
            LoginCredentials credentials = existingCredentials.get();

            // Hash the password if it's being updated
            if (credentialsDetails.getPassword() != null && !credentialsDetails.getPassword().isEmpty()) {
                credentials.setPassword(authService.hashPassword(credentialsDetails.getPassword()));
            }

            credentials.setUserType(credentialsDetails.getUserType());
            credentials.setFirstTimeLogin(credentialsDetails.getFirstTimeLogin());

            LoginCredentials updatedCredentials = loginCredentialsRepository.save(credentials);
            return ResponseEntity.ok(updatedCredentials);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteLoginCredentials(@PathVariable String username) {
        Optional<LoginCredentials> credentials = loginCredentialsRepository.findByUsername(username);

        if (credentials.isPresent()) {
            loginCredentialsRepository.delete(credentials.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
