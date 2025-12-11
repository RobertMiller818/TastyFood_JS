package com.tastyfood.backend.repository;

import com.tastyfood.backend.model.Order;
import com.tastyfood.backend.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByOrderNo(String orderNo);
    List<Order> findByDeliveryStatus(String deliveryStatus);
    List<Order> findByDriver(Driver driver);
    List<Order> findByDeliveryStatusNot(String deliveryStatus);
    List<Order> findByDeliveryStatusNotIn(List<String> statuses);
    Optional<Order> findFirstByOrderByOrderNoDesc();
}
