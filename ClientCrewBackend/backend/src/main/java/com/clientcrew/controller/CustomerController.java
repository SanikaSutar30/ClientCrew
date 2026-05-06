package com.clientcrew.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.entity.User;
import com.clientcrew.service.CustomerService;

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
    public User addCustomer(@RequestBody User customer, Authentication authentication) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        System.out.println("ROLE = " + role);
        System.out.println("EMAIL = " + authentication.getName());

        return customerService.addCustomer(customer, role);
    }
}