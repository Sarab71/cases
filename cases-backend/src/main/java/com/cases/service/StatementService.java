package com.cases.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cases.dto.StatementTransactionDTO;
import com.cases.model.Bill;
import com.cases.model.Transaction;
import com.cases.repository.BillRepository;
import com.cases.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatementService {

    private final TransactionRepository transactionRepository;
    private final BillRepository billRepository;

    public List<StatementTransactionDTO> getCustomerStatement(String customerId) {
        List<Transaction> transactions = transactionRepository
                .findByCustomer_IdOrderByDateAsc(customerId); // 🟢 Note: use embedded Customer reference

        BigDecimal balance = BigDecimal.ZERO;

        // Get all related bill IDs
        List<String> billIds = transactions.stream()
                .filter(t -> t.getRelatedBill() != null)
                .map(t -> t.getRelatedBill().getId())
                .collect(Collectors.toList());

        List<Bill> bills = billRepository.findAllById(billIds);
        Map<String, Integer> billMap = new HashMap<>();
        for (Bill bill : bills) {
            billMap.put(bill.getId(), bill.getInvoiceNumber());
        }

        List<StatementTransactionDTO> statement = new ArrayList<>();

        for (Transaction txn : transactions) {
            boolean isDebit = txn.getType().equalsIgnoreCase("debit");
            BigDecimal amount = BigDecimal.valueOf(txn.getAmount());

            if (isDebit) {
                balance = balance.subtract(amount);
            } else {
                balance = balance.add(amount);
            }

            Integer invoiceNumber = txn.getInvoiceNumber();
            String relatedBillId = txn.getRelatedBill() != null ? txn.getRelatedBill().getId() : null;

            if (invoiceNumber == null && relatedBillId != null) {
                invoiceNumber = billMap.getOrDefault(relatedBillId, null);
            }

            statement.add(new StatementTransactionDTO(
                    txn.getId(),
                    txn.getDate(),
                    isDebit ? "Invoice #" + (invoiceNumber != null ? invoiceNumber : "N/A") : "Payment Received",
                    isDebit ? amount.intValue() : null,
                    !isDebit ? amount.intValue() : null,
                    balance.intValue(),
                    invoiceNumber,
                    relatedBillId,
                    txn.getType(),
                    amount,
                    txn.getDescription()
            ));
        }

        return statement;
    }
}
