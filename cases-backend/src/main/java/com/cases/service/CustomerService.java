package com.cases.service;

import com.cases.dto.CustomerRequestDto;
import com.cases.dto.CustomerResponseDto;
import com.cases.dto.OutstandingResponseDto;
import com.cases.model.Customer;
import com.cases.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerResponseDto createCustomer(CustomerRequestDto requestDto) {
        if (customerRepository.existsByName(requestDto.getName())) {
            throw new RuntimeException("Customer with name already exists!");
        }

        Customer customer = Customer.builder()
                .name(requestDto.getName())
                .phone(requestDto.getPhone())
                .address(requestDto.getAddress())
                .balance(requestDto.getBalance())
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        return convertToResponseDto(savedCustomer);
    }

    public List<CustomerResponseDto> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public CustomerResponseDto getCustomerById(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        return convertToResponseDto(customer);
    }

    public CustomerResponseDto updateCustomer(String id, CustomerRequestDto requestDto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

        customer.setName(requestDto.getName());
        customer.setPhone(requestDto.getPhone());
        customer.setAddress(requestDto.getAddress());
        customer.setBalance(requestDto.getBalance());

        Customer updatedCustomer = customerRepository.save(customer);
        return convertToResponseDto(updatedCustomer);
    }

    public void deleteCustomer(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        customerRepository.delete(customer);
    }

    private CustomerResponseDto convertToResponseDto(Customer customer) {
        CustomerResponseDto responseDto = new CustomerResponseDto();
        BeanUtils.copyProperties(customer, responseDto);
        return responseDto;
    }

    public OutstandingResponseDto getOutstanding(String startDate, String endDate) {
        // parse karenge ISO date strings se
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate).plusDays(1); // include full endDate
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atStartOfDay();

        List<Customer> list = customerRepository.findByUpdatedAtBetween(startDt, endDt);
        double sum = list.stream()
                .mapToDouble(Customer::getBalance)
                .sum();

        return new OutstandingResponseDto(sum);
    }

    public double calculateOutstandingBetweenDates(String startDateStr, String endDateStr) {
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr).plusDays(1); // exclusive end

        return customerRepository.findAll().stream()
                .filter(c -> {
                    LocalDate updatedAt = c.getUpdatedAt().toLocalDate();
                    return (updatedAt.isEqual(startDate) || updatedAt.isAfter(startDate))
                            && updatedAt.isBefore(endDate);
                })
                .mapToDouble(Customer::getBalance)
                .sum();
    }

    public double calculateTotalOutstanding() {
        return customerRepository.findAll().stream()
                .mapToDouble(Customer::getBalance)
                .sum();
    }

}
