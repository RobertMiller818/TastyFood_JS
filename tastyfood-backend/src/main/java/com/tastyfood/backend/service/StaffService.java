package com.tastyfood.backend.service;

import com.tastyfood.backend.model.LoginCredentials;
import com.tastyfood.backend.model.Staff;
import com.tastyfood.backend.repository.LoginCredentialsRepository;
import com.tastyfood.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private LoginCredentialsRepository loginCredentialsRepository;

    @Autowired
    private AuthService authService;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffById(Integer id) {
        return staffRepository.findById(id);
    }

    public Staff createStaff(Staff staff) {
        // Validate email is provided
        if (staff.getEmail() == null || staff.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        // Check if email already exists
        if (staffRepository.existsByEmail(staff.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check if staff already exists
        if (staffRepository.existsByFirstNameAndLastName(staff.getFirstName(), staff.getLastName())) {
            throw new RuntimeException("Staff member already exists");
        }

        // Set default status if not provided
        if (staff.getStatus() == null || staff.getStatus().trim().isEmpty()) {
            staff.setStatus("Active");
        }

        // Validate status value
        if (!staff.getStatus().equals("Active") && !staff.getStatus().equals("Inactive")) {
            throw new RuntimeException("Status must be either 'Active' or 'Inactive'");
        }

        // Generate username based on last name
        String username = generateUsername(staff.getLastName());
        staff.setUsername(username);

        // Save the staff member
        Staff savedStaff = staffRepository.save(staff);

        // Automatically create login credentials for the new staff member
        LoginCredentials loginCredentials = new LoginCredentials();
        loginCredentials.setUsername(username);
        loginCredentials.setPassword(authService.hashPassword("password"));
        loginCredentials.setUserType("STAFF");
        loginCredentials.setFirstTimeLogin(true);
        loginCredentialsRepository.save(loginCredentials);

        return savedStaff;
    }

    private String generateUsername(String lastName) {
        // Find all staff members with usernames starting with this last name
        List<Staff> existingStaff = staffRepository.findByUsernameStartingWith(lastName);

        // Find the highest number used for this last name
        int maxNumber = 0;
        for (Staff existingMember : existingStaff) {
            String username = existingMember.getUsername();
            if (username != null && username.startsWith(lastName)) {
                // Extract the number part from the username
                String numberPart = username.substring(lastName.length());
                try {
                    int number = Integer.parseInt(numberPart);
                    if (number > maxNumber) {
                        maxNumber = number;
                    }
                } catch (NumberFormatException e) {
                    // Skip if the suffix is not a valid number
                }
            }
        }

        // Generate the next username with zero-padded two-digit number
        int nextNumber = maxNumber + 1;
        return String.format("%s%02d", lastName, nextNumber);
    }

    public Staff updateStaff(Integer id, Staff staffDetails) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (staffDetails.getFirstName() != null) {
            staff.setFirstName(staffDetails.getFirstName());
        }
        if (staffDetails.getLastName() != null) {
            staff.setLastName(staffDetails.getLastName());
        }
        if (staffDetails.getEmail() != null) {
            // Check if email is being changed and if new email already exists
            if (!staffDetails.getEmail().equals(staff.getEmail()) &&
                staffRepository.existsByEmail(staffDetails.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            staff.setEmail(staffDetails.getEmail());
        }
        if (staffDetails.getStatus() != null) {
            // Validate status value
            if (!staffDetails.getStatus().equals("Active") && !staffDetails.getStatus().equals("Inactive")) {
                throw new RuntimeException("Status must be either 'Active' or 'Inactive'");
            }
            staff.setStatus(staffDetails.getStatus());
        }

        return staffRepository.save(staff);
    }

    public void deleteStaff(Integer id) {
        staffRepository.deleteById(id);
    }
}
