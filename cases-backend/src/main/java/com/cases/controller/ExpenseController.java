package com.cases.controller;

import com.cases.dto.ExpenseRequestDTO;
import com.cases.dto.ExpenseUpdateDto;
import com.cases.model.ExpenseCategory;
import com.cases.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseCategory> addExpense(@RequestBody ExpenseRequestDTO dto) {
        try {
            ExpenseCategory saved = expenseService.addExpense(dto);
            return ResponseEntity.status(201).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<ExpenseCategory>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, Double>> getTotalExpenses(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        double total = expenseService.getTotalExpensesInDateRange(startDate, endDate);
        return ResponseEntity.ok(Map.of("totalExpenses", total));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, String>>> getCategorySuggestions(@RequestParam String query) {
        List<String> suggestions = expenseService.getCategorySuggestions(query);

        List<Map<String, String>> response = suggestions.stream()
                .map(cat -> Map.of("id", cat, "category", cat))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PatchMapping
    public ResponseEntity<?> updateExpense(@RequestBody ExpenseUpdateDto dto) {
        try {
            ExpenseCategory updated = expenseService.updateExpense(dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteExpense(
            @RequestParam String category,
            @RequestParam int index) {
        try {
            ExpenseCategory updated = expenseService.deleteExpense(category, index);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/category")
    public ResponseEntity<?> deleteCategory(@RequestParam String category) {
        try {
            expenseService.deleteCategory(category);
            return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
