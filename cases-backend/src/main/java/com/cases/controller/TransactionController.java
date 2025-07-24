package com.cases.controller;

import com.cases.model.Transaction;
import com.cases.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.createTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable String id) {
        return transactionService.getTransactionById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    @GetMapping("/customer/{customerId}")
    public List<Transaction> getTransactionsForCustomer(@PathVariable String customerId) {
        return transactionService.getTransactionsForCustomer(customerId);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
    }
}
