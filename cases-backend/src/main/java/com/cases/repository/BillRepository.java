package com.cases.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cases.model.Bill;

public interface BillRepository extends MongoRepository<Bill, String> {
    Optional<Bill> findTopByOrderByInvoiceNumberDesc(); // for auto-increment
}
