package com.cases.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cases.dto.StatementTransactionDTO;
import com.cases.service.StatementService;

import lombok.RequiredArgsConstructor;

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
