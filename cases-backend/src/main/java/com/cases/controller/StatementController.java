package com.cases.controller;

import com.cases.dto.StatementTransactionDTO;
import com.cases.service.StatementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customers")
public class StatementController {

    private final StatementService statementService;

    @GetMapping("/{id}/statement")
    public ResponseEntity<List<StatementTransactionDTO>> getCustomerStatement(@PathVariable String id) {
        try {
            List<StatementTransactionDTO> statement = statementService.getCustomerStatement(id);
            return ResponseEntity.ok(statement);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
