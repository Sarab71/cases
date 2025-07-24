package com.cases.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatementTransactionDTO {
    private String id;
    private Date date;
    private String particulars;
    private Integer debit;
    private Integer credit;
    private Integer balance;
    private Integer invoiceNumber;
    private String relatedBillId;
    private String type;
    private BigDecimal amount;
    private String description;
}
