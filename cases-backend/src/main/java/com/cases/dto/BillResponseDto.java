package com.cases.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.cases.model.BillItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillResponseDto {
    private String id;
    private int invoiceNumber;
    private String customerId;
    private LocalDateTime date;
    private List<BillItem> items;
    private double grandTotal;
    private LocalDate dueDate;

}
