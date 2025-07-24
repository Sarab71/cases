package com.cases.model;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {
    private String description;
    private double amount;
    private LocalDate date;
}
