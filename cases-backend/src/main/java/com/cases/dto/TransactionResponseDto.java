package com.cases.dto;

import lombok.*;
import java.time.LocalDateTime;

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
