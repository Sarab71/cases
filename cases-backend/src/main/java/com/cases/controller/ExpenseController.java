package com.cases.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cases.dto.CreateExpenseCategoryDto;
import com.cases.dto.CreateExpenseDto;
import com.cases.model.Expense;
import com.cases.model.ExpenseCategory;
import com.cases.service.ExpenseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService service;

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody CreateExpenseDto dto) {
        return ResponseEntity.ok(service.createExpense(dto));
    }

    @PostMapping("/categories")
    public ResponseEntity<ExpenseCategory> createCategory(@RequestBody CreateExpenseCategoryDto dto) {
        return ResponseEntity.ok(service.createCategory(dto));
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable String id) {
        return ResponseEntity.ok(service.getExpensesByCategory(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ExpenseCategory>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, Double>> getTotalExpenses(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        LocalDate start = (startDate != null && !startDate.isEmpty())
                ? LocalDate.parse(startDate)
                : LocalDate.of(1970, 1, 1);

        LocalDate end = (endDate != null && !endDate.isEmpty())
                ? LocalDate.parse(endDate)
                : LocalDate.now();

        double total = service.getTotalBetweenDates(start, end);
        return ResponseEntity.ok(Map.of("totalExpenses", total));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

}
