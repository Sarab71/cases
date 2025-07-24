package com.cases.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

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
