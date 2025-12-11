package com.tastyfood.backend.service;

import com.tastyfood.backend.model.Driver;
import com.tastyfood.backend.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Optional<Driver> getDriverById(Integer id) {
        return driverRepository.findById(id);
    }

    public List<Driver> getAvailableDrivers() {
        // Only return drivers with status "Active"
        return driverRepository.findByStatus("Active");
    }

    public List<Driver> getActiveDrivers() {
        return driverRepository.findByStatus("Active");
    }

    public Driver createDriver(Driver driver) {
        // Check if driver already exists
        if (driverRepository.existsByFirstNameAndLastName(driver.getFirstName(), driver.getLastName())) {
            throw new RuntimeException("Driver already exists");
        }

        // Set default statuses if not provided
        if (driver.getEmploymentStatus() == null) {
            driver.setEmploymentStatus(true);
        }
        if (driver.getAvailabilityStatus() == null) {
            driver.setAvailabilityStatus(true);
        }
        if (driver.getStatus() == null) {
            driver.setStatus("Active");
        }

        return driverRepository.save(driver);
    }

    public Driver updateDriver(Integer id, Driver driverDetails) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (driverDetails.getFirstName() != null) {
            driver.setFirstName(driverDetails.getFirstName());
        }
        if (driverDetails.getLastName() != null) {
            driver.setLastName(driverDetails.getLastName());
        }
        if (driverDetails.getEmploymentStatus() != null) {
            driver.setEmploymentStatus(driverDetails.getEmploymentStatus());
        }
        if (driverDetails.getAvailabilityStatus() != null) {
            driver.setAvailabilityStatus(driverDetails.getAvailabilityStatus());
        }
        if (driverDetails.getStatus() != null) {
            driver.setStatus(driverDetails.getStatus());
        }

        return driverRepository.save(driver);
    }

    public void deleteDriver(Integer id) {
        driverRepository.deleteById(id);
    }
}
