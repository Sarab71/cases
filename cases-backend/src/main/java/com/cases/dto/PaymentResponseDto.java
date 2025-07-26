package com.cases.dto;

import com.cases.model.Transaction;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponseDto {
    private String message;
    private Transaction transaction;
    private double updatedBalance;
}
