package com.cases.repository;

import com.cases.model.Customer;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    boolean existsByName(String name);
    List<Customer> findByUpdatedAtBetween(LocalDateTime start, LocalDateTime end);
}
