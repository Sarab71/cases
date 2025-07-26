package com.cases.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cases.model.Customer;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    boolean existsByName(String name);
    List<Customer> findByUpdatedAtBetween(LocalDateTime start, LocalDateTime end);
}
