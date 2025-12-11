package com.tastyfood.backend.service;

import com.tastyfood.backend.model.Order;
import com.tastyfood.backend.model.OrderLineItem;
import com.tastyfood.backend.model.MenuItem;
import com.tastyfood.backend.model.Driver;
import com.tastyfood.backend.repository.OrderRepository;
import com.tastyfood.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private com.tastyfood.backend.repository.DriverRepository driverRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public Optional<Order> getOrderByOrderNumber(String orderNo) {
        return orderRepository.findByOrderNo(orderNo);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByDeliveryStatus(status);
    }

    public List<Order> getActiveOrders() {
        // Exclude completed and delivered orders from active list
        return orderRepository.findByDeliveryStatusNotIn(List.of("COMPLETED", "DELIVERED"));
    }

    @Transactional
    public Order createOrder(Order order) {
        // Generate next OrderNo in format "FD####"
        String nextOrderNo = generateNextOrderNo();
        order.setOrderNo(nextOrderNo);

        // Set date and time if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDate.now());
        }
        if (order.getOrderTime() == null) {
            order.setOrderTime(LocalTime.now());
        }

        // Set default status
        if (order.getDeliveryStatus() == null) {
            order.setDeliveryStatus("PENDING");
        }

        // Link order items to the order and set MenuItem entities
        if (order.getItems() != null) {
            for (OrderLineItem item : order.getItems()) {
                // Look up the MenuItem entity using the itemId from the JSON
                if (item.getItemId() != null) {
                    MenuItem menuItem = menuItemRepository.findById(item.getItemId())
                            .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + item.getItemId()));
                    item.setMenuItem(menuItem);
                }
                // Clear the itemId field since it's managed by the MenuItem relationship
                item.setItemId(null);
                item.setOrder(order);
            }
        }

        return orderRepository.save(order);
    }

    private String generateNextOrderNo() {
        // Get the last order by OrderNo (descending)
        Optional<Order> lastOrder = orderRepository.findFirstByOrderByOrderNoDesc();

        int nextNumber = 1;
        if (lastOrder.isPresent()) {
            String lastOrderNo = lastOrder.get().getOrderNo();
            // Extract the numeric part after "FD"
            String numericPart = lastOrderNo.substring(2);
            nextNumber = Integer.parseInt(numericPart) + 1;
        }

        // Format as FD#### (e.g., FD0001, FD0002, etc.)
        return String.format("FD%04d", nextNumber);
    }

    @Transactional
    public Order updateOrder(String id, Order orderDetails) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (orderDetails.getDeliveryStatus() != null) {
            order.setDeliveryStatus(orderDetails.getDeliveryStatus());
        }
        if (orderDetails.getDriver() != null) {
            order.setDriver(orderDetails.getDriver());
        }
        if (orderDetails.getDeliveryETA() != null) {
            order.setDeliveryETA(orderDetails.getDeliveryETA());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order assignDriver(String orderId, Integer driverId) {
        System.out.println("Troubleshooting: OrderService.assignDriver called");
        System.out.println("Query for order with ID: " + orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    System.err.println("Order not found with ID: " + orderId);
                    return new RuntimeException("Order not found");
                });

        System.out.println("Found order: " + order.getOrderNo());

        Driver driver = null;
        if (driverId != null) {
            System.out.println("Query for driver with ID: " + driverId);
            driver = driverRepository.findById(driverId)
                    .orElseThrow(() -> {
                        System.err.println("Driver not found with ID: " + driverId);
                        return new RuntimeException("Driver not found");
                    });
            System.out.println("Found driver: " + driver.getFirstName() + " " + driver.getLastName());
        }

        order.setDriver(driver);
        // Store or clear driver name in the order record
        // Status remains PENDING until staff completes the order
        if (driver != null) {
            // Store driver name in the order record
            order.setDriverFirstname(driver.getFirstName());
            order.setDriverLastname(driver.getLastName());
            System.out.println("Assigned driver to order");
        } else {
            // Clear driver name fields when unassigning
            order.setDriverFirstname(null);
            order.setDriverLastname(null);
            System.out.println("Unassigned driver from order");
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order completeOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setDeliveryStatus("COMPLETED");
        order.setDeliveryDate(LocalDate.now());
        order.setDeliveryTime(LocalTime.now());

        return orderRepository.save(order);
    }

    // Keep for backwards compatibility if needed
    @Transactional
    public Order markAsDelivered(String orderId) {
        return completeOrder(orderId);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}
