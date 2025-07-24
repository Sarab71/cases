package com.cases.controller;

import com.cases.dto.CustomerRequestDto;
import com.cases.dto.CustomerResponseDto;
import com.cases.dto.OutstandingResponseDto;
import com.cases.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // ✅ Create customer
    @PostMapping
    public ResponseEntity<CustomerResponseDto> createCustomer(@RequestBody CustomerRequestDto requestDto) {
        CustomerResponseDto response = customerService.createCustomer(requestDto);
        return ResponseEntity.ok(response);
    }

    // ✅ Get all customers
    @GetMapping
    public ResponseEntity<List<CustomerResponseDto>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // ✅ Get customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDto> getCustomerById(@PathVariable String id) {
        CustomerResponseDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    // ✅ Update customer
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDto> updateCustomer(@PathVariable String id,
            @RequestBody CustomerRequestDto requestDto) {
        CustomerResponseDto updated = customerService.updateCustomer(id, requestDto);
        return ResponseEntity.ok(updated);
    }

    // ✅ Delete customer
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }

    @GetMapping("/outstanding")
    public ResponseEntity<OutstandingResponseDto> getOutstandingBetweenDates(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        double totalOutstanding;

        if (startDate != null && endDate != null) {
            totalOutstanding = customerService.calculateOutstandingBetweenDates(startDate, endDate);
        } else {
            totalOutstanding = customerService.calculateTotalOutstanding();
        }

        return ResponseEntity.ok(new OutstandingResponseDto(totalOutstanding));
    }

}
