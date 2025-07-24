package com.cases.service;

import com.cases.model.Transaction;
import com.cases.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getDate() == null) {
            transaction.setDate(new Date());
        }
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(String id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getTransactionsForCustomer(String customerId) {
        return transactionRepository.findByCustomer_IdOrderByDateAsc(customerId); // ✅ fixed
    }

    public Optional<Transaction> getTransactionByRelatedBillId(String billId) {
        return transactionRepository.findByRelatedBill_Id(billId); // ✅ fixed
    }

    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }
}
