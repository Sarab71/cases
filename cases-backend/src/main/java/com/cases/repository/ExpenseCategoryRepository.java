package com.cases.repository;

import com.cases.model.ExpenseCategory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ExpenseCategoryRepository extends MongoRepository<ExpenseCategory, String> {
    Optional<ExpenseCategory> findByCategory(String category);
}
