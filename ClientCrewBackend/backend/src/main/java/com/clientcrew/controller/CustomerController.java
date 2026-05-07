package com.clientcrew.controller;

import java.util.List;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.entity.User;
import com.clientcrew.service.CustomerService;
import com.clientcrew.dto.CustomerRequest;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<User> getCustomers(Authentication authentication) {
        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        return customerService.getCustomersByRole(email, role);
    }
    
    @PostMapping
    public User addCustomer(@RequestBody CustomerRequest request, Authentication authentication) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        String email = authentication.getName();

        return customerService.addCustomer(request, role, email);
    }

    
    @PutMapping("/{id}")
    public User updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerRequest request,
            Authentication authentication) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        String email = authentication.getName();

        return customerService.updateCustomer(id, request, role, email);
    }
    @DeleteMapping("/{id}")
    public void deleteCustomer(
            @PathVariable Long id,
            Authentication authentication) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        customerService.deleteCustomer(id, role);
    }
}
