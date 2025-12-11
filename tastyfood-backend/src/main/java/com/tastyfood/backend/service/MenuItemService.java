package com.tastyfood.backend.service;

import com.tastyfood.backend.model.MenuItem;
import com.tastyfood.backend.repository.MenuItemRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @PostConstruct
    public void initializeMenuItems() {
        // Only initialize if the database is empty
        if (menuItemRepository.count() == 0) {
            List<MenuItem> menuItems = List.of(
                new MenuItem(1, "Tom Kha", "appetizers", new BigDecimal("6.99"), "Available"),
                new MenuItem(2, "Tom Yum", "appetizers", new BigDecimal("6.99"), "Available"),
                new MenuItem(3, "Satay", "appetizers", new BigDecimal("8.99"), "Available"),
                new MenuItem(4, "Veggie Egg Rolls", "appetizers", new BigDecimal("7.99"), "Available"),
                new MenuItem(5, "Pork Eggrolls", "appetizers", new BigDecimal("8.99"), "Available"),
                new MenuItem(6, "Pad Thai", "entrees", new BigDecimal("17.99"), "Available"),
                new MenuItem(7, "Khao Soi", "entrees", new BigDecimal("17.99"), "Available"),
                new MenuItem(8, "Pad See Lew", "entrees", new BigDecimal("17.99"), "Available"),
                new MenuItem(9, "Khao Pad", "entrees", new BigDecimal("16.99"), "Available"),
                new MenuItem(10, "Thai Tea", "beverages", new BigDecimal("4.99"), "Available"),
                new MenuItem(11, "Thai Coffee", "beverages", new BigDecimal("5.99"),  "Available"),
                new MenuItem(12, "Soft Drink", "beverages", new BigDecimal("3.99"), "Available")
            );
            menuItemRepository.saveAll(menuItems);
        }
    }

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public Optional<MenuItem> getMenuItemById(Integer id) {
        return menuItemRepository.findById(id);
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByAvailability("Available");
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Integer id, MenuItem menuItemDetails) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (menuItemDetails.getItemName() != null) {
            menuItem.setItemName(menuItemDetails.getItemName());
        }
        if (menuItemDetails.getPrice() != null) {
            menuItem.setPrice(menuItemDetails.getPrice());
        }
        if (menuItemDetails.getCategory() != null) {
            menuItem.setCategory(menuItemDetails.getCategory());
        }
        if (menuItemDetails.getAvailability() != null) {
            menuItem.setAvailability(menuItemDetails.getAvailability());
        }

        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Integer id) {
        menuItemRepository.deleteById(id);
    }
}
