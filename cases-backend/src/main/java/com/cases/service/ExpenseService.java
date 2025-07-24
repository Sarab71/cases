package com.cases.service;

import com.cases.dto.ExpenseRequestDTO;
import com.cases.dto.ExpenseUpdateDto;
import com.cases.model.ExpenseCategory;
import com.cases.repository.ExpenseCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.text.SimpleDateFormat;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseCategoryRepository categoryRepository;

    public ExpenseCategory addExpense(ExpenseRequestDTO dto) {
        if (dto.getCategory() == null || dto.getDescription() == null || dto.getAmount() == 0) {
            throw new IllegalArgumentException("Missing fields");
        }

        ExpenseCategory.Expense expense = ExpenseCategory.Expense.builder()
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .date(dto.getDate() != null ? dto.getDate() : new Date().toInstant().toString().substring(0, 10)) // fallback
                                                                                                                  // to
                                                                                                                  // today
                .build();

        Optional<ExpenseCategory> optionalCategory = categoryRepository.findByCategory(dto.getCategory());

        ExpenseCategory category;
        if (optionalCategory.isPresent()) {
            category = optionalCategory.get();
            category.getExpenses().add(expense);
        } else {
            category = ExpenseCategory.builder()
                    .category(dto.getCategory())
                    .expenses(new ArrayList<>(List.of(expense)))
                    .build();
        }

        return categoryRepository.save(category);
    }

    public List<ExpenseCategory> getAllExpenses() {
        return categoryRepository.findAll();
    }

    public double getTotalExpensesInDateRange(String startDate, String endDate) {
        List<ExpenseCategory> categories = categoryRepository.findAll();
        double total = 0;

        for (ExpenseCategory category : categories) {
            for (ExpenseCategory.Expense expense : category.getExpenses()) {
                String dateStr = expense.getDate();
                if (dateStr == null)
                    continue;

                try {
                    Date date = new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);

                    Date start = (startDate != null) ? new SimpleDateFormat("yyyy-MM-dd").parse(startDate) : null;
                    Date end = (endDate != null) ? new SimpleDateFormat("yyyy-MM-dd").parse(endDate) : null;
                    if (end != null) {
                        Calendar c = Calendar.getInstance();
                        c.setTime(end);
                        c.add(Calendar.DATE, 1);
                        end = c.getTime(); // include full end date
                    }

                    if ((start == null || !date.before(start)) && (end == null || date.before(end))) {
                        total += expense.getAmount();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        return total;
    }

    public ExpenseCategory updateExpense(ExpenseUpdateDto dto) {
        Optional<ExpenseCategory> optional = categoryRepository.findByCategory(dto.getCategory());
        if (optional.isEmpty())
            throw new IllegalArgumentException("Category not found");

        ExpenseCategory category = optional.get();

        if (dto.getIndex() < 0 || dto.getIndex() >= category.getExpenses().size()) {
            throw new IllegalArgumentException("Invalid index");
        }

        ExpenseCategory.Expense updated = ExpenseCategory.Expense.builder()
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .build();

        category.getExpenses().set(dto.getIndex(), updated);
        return categoryRepository.save(category);
    }

    public ExpenseCategory deleteExpense(String categoryName, int index) {
        Optional<ExpenseCategory> optional = categoryRepository.findByCategory(categoryName);
        if (optional.isEmpty())
            throw new IllegalArgumentException("Category not found");

        ExpenseCategory category = optional.get();
        if (index < 0 || index >= category.getExpenses().size()) {
            throw new IllegalArgumentException("Invalid index");
        }

        category.getExpenses().remove(index);
        return categoryRepository.save(category);
    }

    public List<String> getCategorySuggestions(String query) {
        return categoryRepository.findAll().stream()
                .map(ExpenseCategory::getCategory)
                .filter(cat -> cat.toLowerCase().contains(query.toLowerCase()))
                .distinct()
                .toList();
    }

}
