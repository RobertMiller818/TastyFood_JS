package com.tastyfood.backend.controller;

import com.tastyfood.backend.model.Order;
import com.tastyfood.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/order-number/{orderNo}")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNo) {
        return orderService.getOrderByOrderNumber(orderNo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status.toUpperCase()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Order>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getActiveOrders());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order created = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody Order order) {
        try {
            Order updated = orderService.updateOrder(id, order);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/assign-driver")
    public ResponseEntity<Order> assignDriver(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        try {
            System.out.println("=== assignDriver endpoint called ===");
            System.out.println("Order ID: " + id);
            System.out.println("Request body: " + body);
            Integer driverId = body.get("driverId");
            System.out.println("Driver ID: " + driverId);
            Order updated = orderService.assignDriver(id, driverId);
            System.out.println("Successfully assigned driver to order: " + id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.err.println("ERROR in assignDriver: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/complete-order")
    public ResponseEntity<Order> completeOrder(@PathVariable String id) {
        try {
            Order updated = orderService.completeOrder(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Keep old endpoint for backwards compatibility
    @PatchMapping("/{id}/mark-delivered")
    public ResponseEntity<Order> markAsDelivered(@PathVariable String id) {
        try {
            Order updated = orderService.markAsDelivered(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
