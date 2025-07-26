package com.cases.dto;

import java.util.Date;
import java.util.List;

import com.cases.model.BillItem;

import lombok.Data;

@Data
public class BillUpdateRequest {
    private Integer invoiceNumber;
    private List<BillItem> items;
    private Date date;
    private Double grandTotal;
}
