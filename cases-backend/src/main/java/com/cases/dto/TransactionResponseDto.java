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
public class TransactionResponseDto {
    private String id;
    private String type;
    private double amount;
    private LocalDateTime date;
    private String description;
    private String relatedBillId;
    private Integer invoiceNumber;
}
