package com.cases.dto;

import com.cases.model.BillItem;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

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
}
