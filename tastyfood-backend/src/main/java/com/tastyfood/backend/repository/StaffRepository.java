package com.tastyfood.backend.repository;

import com.tastyfood.backend.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    boolean existsByFirstNameAndLastName(String firstName, String lastName);
    boolean existsByEmail(String email);
    List<Staff> findByUsernameStartingWith(String usernamePrefix);
    Optional<Staff> findByUsername(String username);
}
