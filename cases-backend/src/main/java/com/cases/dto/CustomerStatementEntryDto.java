package com.cases.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerStatementEntryDto {
    private String type; // "debit" or "credit"
    private double amount;
    private LocalDateTime date;
    private String description;
    private Integer invoiceNumber;
    private String relatedBillId;
    private double runningBalance;
}
