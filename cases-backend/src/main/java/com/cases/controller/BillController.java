package com.cases.controller;

import com.cases.dto.BillResponseDto;
import com.cases.dto.BillUpdateRequest;
import com.cases.model.BillItem;
import com.cases.service.BillService;
import com.cases.repository.BillRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;
    private final BillRepository billRepository;

    @PostMapping
    public BillResponseDto createBill(
            @RequestParam String customerId,
            @RequestBody BillRequest request) {
        return billService.createBill(customerId, request.getItems());
    }

    @GetMapping
    public List<BillResponseDto> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public BillResponseDto getBillById(@PathVariable String id) {
        return billService.getBillById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bill not found"));
    }

    @Data
    public static class BillRequest {
        private List<BillItem> items;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBill(@PathVariable String id) {
        Map<String, Object> response = billService.deleteBill(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBill(@PathVariable String id, @RequestBody BillUpdateRequest request) {
        return ResponseEntity.ok(billService.updateBill(id, request));
    }

    @GetMapping("/next-invoice-number")
    public ResponseEntity<Integer> getNextInvoiceNumber() {
        int nextInvoiceNumber = billRepository.findTopByOrderByInvoiceNumberDesc()
                .map(b -> b.getInvoiceNumber() + 1)
                .orElse(1001);
        return ResponseEntity.ok(nextInvoiceNumber);
    }

}
