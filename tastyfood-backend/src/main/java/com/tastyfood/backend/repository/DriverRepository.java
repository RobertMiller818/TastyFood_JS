package com.tastyfood.backend.repository;

import com.tastyfood.backend.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {
    boolean existsByFirstNameAndLastName(String firstName, String lastName);
    List<Driver> findByAvailabilityStatus(Boolean availabilityStatus);
    List<Driver> findByStatus(String status);
}
