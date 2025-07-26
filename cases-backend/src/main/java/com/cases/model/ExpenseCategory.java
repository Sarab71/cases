package com.cases.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "expense_categories")
public class ExpenseCategory {

    @Id
    private String id;

    private String category;

    private List<Expense> expenses;

    // Embedded class for Expense
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Expense {
        private String description;
        private double amount;
        private String date; // You can also use `LocalDate` or `Date`
    }
}
