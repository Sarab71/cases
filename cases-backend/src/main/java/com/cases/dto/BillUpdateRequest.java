package com.cases.dto;

import com.cases.model.BillItem;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class BillUpdateRequest {
    private Integer invoiceNumber;
    private List<BillItem> items;
    private Date date;
    private Double grandTotal;
}
