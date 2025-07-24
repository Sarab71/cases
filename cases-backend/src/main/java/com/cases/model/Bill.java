package com.cases.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "bills")
public class Bill {

    @Id
    private String id;

    private int invoiceNumber;

    @DBRef
    private Customer customer; // Reference to Customer document

    private Date date = new Date(); // Default to current date

    private List<BillItem> items; // Embedded list of bill items

    private double grandTotal;
}
