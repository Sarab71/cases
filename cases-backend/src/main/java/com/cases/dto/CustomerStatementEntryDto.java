package com.cases.dto;

import lombok.*;
import java.time.LocalDateTime;

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
