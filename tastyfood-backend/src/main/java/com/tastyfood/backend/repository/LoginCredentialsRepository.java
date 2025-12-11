package com.tastyfood.backend.repository;

import com.tastyfood.backend.model.LoginCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginCredentialsRepository extends JpaRepository<LoginCredentials, String> {
    Optional<LoginCredentials> findByUsername(String username);
}
