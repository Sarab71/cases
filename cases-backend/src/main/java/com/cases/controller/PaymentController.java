package com.cases.controller;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cases.dto.PaymentRequestDto;
import com.cases.dto.PaymentResponseDto;
import com.cases.model.Customer;
import com.cases.model.Transaction;
import com.cases.repository.CustomerRepository;
import com.cases.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    @PostMapping
    public ResponseEntity<?> addPayment(@RequestBody PaymentRequestDto request) {
        try {
            if (request.getCustomerId() == null || request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body("Customer ID and valid amount are required.");
            }

            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElse(null);

            if (customer == null) {
                return ResponseEntity.status(404).body("Customer not found.");
            }

            Date txnDate = request.getDate() != null
                    ? Date.from(Instant.parse(request.getDate()))
                    : new Date();

            Transaction transaction = Transaction.builder()
                    .customer(customer)
                    .amount(request.getAmount())
                    .type("credit")
                    .description(request.getDescription() != null ? request.getDescription() : "Payment Received")
                    .date(txnDate)
                    .build();

            transactionRepository.save(transaction);

            customer.setBalance(customer.getBalance() + request.getAmount());
            customerRepository.save(customer);

            PaymentResponseDto response = new PaymentResponseDto(
                    "Payment recorded successfully.",
                    transaction,
                    customer.getBalance());

            return ResponseEntity.status(201).body(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error adding payment: " + e.getMessage());
        }
    }

    // ✅ GET Payment By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable String id) {
        Optional<Transaction> optional = transactionRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Payment not found"));
        }

        Transaction payment = optional.get();

        if (!"credit".equalsIgnoreCase(payment.getType())) {
            return ResponseEntity.badRequest().body(Map.of("message", "This transaction is not a payment (credit)"));
        }

        return ResponseEntity.ok(payment);
    }

    // ✅ PATCH: Update Payment & Adjust Customer Balance
    @PatchMapping("/{id}")
    public ResponseEntity<?> updatePayment(
            @PathVariable String id,
            @RequestBody PaymentRequestDto request) {
        Optional<Transaction> optional = transactionRepository.findById(id);

        if (optional.isEmpty() || !"credit".equalsIgnoreCase(optional.get().getType())) {
            return ResponseEntity.status(404).body(Map.of("message", "Payment not found"));
        }

        Transaction payment = optional.get();
        Customer customer = payment.getCustomer();

        if (customer == null || !customerRepository.existsById(customer.getId())) {
            return ResponseEntity.status(404).body(Map.of("message", "Customer not found"));
        }

        double oldAmount = payment.getAmount();
        double newAmount = request.getAmount();

        // Balance Adjustment
        customer.setBalance(customer.getBalance() - oldAmount + newAmount);
        customerRepository.save(customer);

        // Payment Update
        payment.setAmount(newAmount);

        if (request.getDescription() != null) {
            payment.setDescription(request.getDescription());
        }

        if (request.getDate() != null) {
            payment.setDate(Date.from(Instant.parse(request.getDate())));
        }

        transactionRepository.save(payment);

        return ResponseEntity.ok(Map.of(
                "message", "Payment updated successfully",
                "payment", payment,
                "updatedBalance", customer.getBalance()));
    }

    // ✅ GET Total Payments (with optional date filters)
    @GetMapping("/total")
    public ResponseEntity<?> getTotalPayments(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<Transaction> creditTxns;

            if (startDate != null && endDate != null) {
                Date start = Date.from(Instant.parse(startDate));
                Date end = Date.from(Instant.parse(endDate));

                creditTxns = transactionRepository.findByTypeAndDateBetween("credit", start, end);
            } else {
                creditTxns = transactionRepository.findByType("credit");
            }

            double total = creditTxns.stream()
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            return ResponseEntity.ok(Map.of(
                    "totalPayment", total,
                    "count", creditTxns.size()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching total payments: " + e.getMessage());
        }
    }

    // ✅ DELETE: Delete Payment & Adjust Customer Balance
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable String id) {
        Optional<Transaction> optional = transactionRepository.findById(id);

        if (optional.isEmpty() || !"credit".equalsIgnoreCase(optional.get().getType())) {
            return ResponseEntity.status(404).body(Map.of("message", "Payment not found"));
        }

        Transaction payment = optional.get();
        Customer customer = payment.getCustomer();

        if (customer == null || !customerRepository.existsById(customer.getId())) {
            return ResponseEntity.status(404).body(Map.of("message", "Customer not found"));
        }

        // Balance Adjustment
        customer.setBalance(customer.getBalance() - payment.getAmount());
        customerRepository.save(customer);

        // Delete Payment
        transactionRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Payment deleted successfully",
                "updatedBalance", customer.getBalance()));
    }

}
