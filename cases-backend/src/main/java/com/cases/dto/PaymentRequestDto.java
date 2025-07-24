package com.cases.dto;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private String customerId;
    private double amount;
    private String description;
    private String date; // optional (ISO 8601 format)
}
