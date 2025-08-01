package com.cases.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cases.dto.BillRequestDto;
import com.cases.dto.BillResponseDto;
import com.cases.dto.BillUpdateRequestDto;
import com.cases.model.Bill;
import com.cases.model.BillItem;
import com.cases.model.Customer;
import com.cases.model.Transaction;
import com.cases.repository.BillRepository;
import com.cases.repository.CustomerRepository;
import com.cases.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    public BillResponseDto createBill(BillRequestDto request) {
        Optional<Customer> optionalCustomer = customerRepository.findById(request.getCustomerId());
        if (optionalCustomer.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }

        int latestInvoiceNumber = billRepository.findTopByOrderByInvoiceNumberDesc()
                .map(b -> b.getInvoiceNumber() + 1)
                .orElse(1001);

        Bill bill = new Bill();
        bill.setCustomer(optionalCustomer.get());
        bill.setInvoiceNumber(latestInvoiceNumber);
        bill.setItems(request.getItems());
        bill.setTotalQty(request.getTotalQty());
        bill.setGrandTotal(request.getGrandTotal());
        bill.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        bill.setDueDate(LocalDate.now());

        Bill saved = billRepository.save(bill);

        Transaction transaction = Transaction.builder()
                .customer(optionalCustomer.get())
                .amount(request.getGrandTotal())
                .type("debit")
                .description("Bill Invoice #" + latestInvoiceNumber)
                .date(bill.getDate())
                .relatedBill(saved) // ✅ Reference full Bill object, not ID
                .invoiceNumber(latestInvoiceNumber)
                .build();

        transactionRepository.save(transaction);

        // Update customer balance
        Customer customer = optionalCustomer.get();
        customer.setBalance(customer.getBalance() - request.getGrandTotal());
        customerRepository.save(customer);

        return convertToDto(saved);
    }

    public List<BillResponseDto> getAllBills() {
        return billRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<BillResponseDto> getBillById(String id) {
        return billRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<BillResponseDto> getBillsByDueDate(LocalDate dueDate) {
        List<Bill> bills = billRepository.findByDueDate(dueDate);
        return bills.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Map<String, Object> updateBill(String billId, BillUpdateRequestDto request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        double oldGrandTotal = bill.getGrandTotal();

        List<BillItem> updatedItems = request.getItems();

        double newGrandTotal = request.getGrandTotal();

        bill.setItems(updatedItems);
        bill.setTotalQty(request.getTotalQty());
        bill.setInvoiceNumber(
                request.getInvoiceNumber() != null ? request.getInvoiceNumber() : bill.getInvoiceNumber());
        bill.setGrandTotal(newGrandTotal);
        if (request.getDate() != null) {
            bill.setDate(request.getDate());
        }
        if (request.getDueDate() != null) {
            bill.setDueDate(request.getDueDate());
        }
        billRepository.save(bill);

        Optional<Transaction> transactionOpt = transactionRepository.findByRelatedBill_Id(billId);

        transactionOpt.ifPresent(transaction -> {
            transaction.setAmount(newGrandTotal);
            transaction.setDescription("Updated Bill Invoice #" + bill.getInvoiceNumber());
            if (request.getDate() != null) {
                transaction.setDate(request.getDate());
            }
            transactionRepository.save(transaction);
        });

        Customer customer = customerRepository.findById(bill.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setBalance(customer.getBalance() + (oldGrandTotal - newGrandTotal));
        customerRepository.save(customer);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bill, transaction, and customer balance updated.");
        response.put("bill", bill);
        transactionOpt.ifPresent(t -> response.put("transaction", t));
        response.put("updatedBalance", customer.getBalance());

        return response;
    }

    public Map<String, Object> deleteBill(String billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        Optional<Transaction> transactionOpt = transactionRepository.findByRelatedBill_Id(billId);

        Customer customer = customerRepository.findById(bill.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Delete bill and transaction
        billRepository.delete(bill);
        transactionOpt.ifPresent(transactionRepository::delete);

        // Update customer balance
        customer.setBalance(customer.getBalance() + bill.getGrandTotal());
        customerRepository.save(customer);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bill deleted, transaction removed, customer balance updated.");
        response.put("updatedBalance", customer.getBalance());
        return response;
    }

    private BillResponseDto convertToDto(Bill bill) {
        return BillResponseDto.builder()
                .id(bill.getId())
                .invoiceNumber(bill.getInvoiceNumber())
                .customerId(bill.getCustomer().getId())
                .customerName(bill.getCustomer().getName())
                .date(bill.getDate())
                .items(bill.getItems())
                .totalQty(bill.getTotalQty())
                .grandTotal(bill.getGrandTotal())
                .dueDate(bill.getDueDate())
                .build();
    }
}
