package com.cases.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerResponseDto {
    private String id;
    private String name;
    private String phone;
    private String address;
    private double balance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
