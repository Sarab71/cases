package com.cases.dto;

import java.time.LocalDate;
import java.util.List;

import com.cases.model.BillItem;

import lombok.Data;

@Data
public class BillRequestDto {
    private String customerId;
    private List<BillItem> items;
    private LocalDate date;           // e.g., bill creation date
    private LocalDate dueDate;   // e.g., bill due date
}
