package com.cases.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseRequestDTO {
    private String category;
    private String description;
    private double amount;
    private String date; // Optional, parse later
}
