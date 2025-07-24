package com.cases.repository;

import com.cases.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BillRepository extends MongoRepository<Bill, String> {
    Optional<Bill> findTopByOrderByInvoiceNumberDesc(); // for auto-increment
}
