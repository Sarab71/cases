package com.cases.dto;

import lombok.Data;

@Data
public class ExpenseUpdateDto {
    private String category;
    private int index; // index of the expense to update
    private String description;
    private double amount;
    private String date;
}
