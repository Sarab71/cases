package com.cases.dto;

import java.time.LocalDateTime;

import lombok.Data;

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
