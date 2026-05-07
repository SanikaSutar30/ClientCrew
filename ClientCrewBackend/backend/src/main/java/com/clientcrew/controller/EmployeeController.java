package com.clientcrew.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.dto.EmployeeRequest;
import com.clientcrew.entity.User;
import com.clientcrew.service.EmployeeService;
import com.clientcrew.dto.EmployeeResponse;


@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeResponse> getEmployees(Authentication authentication) {
        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        return employeeService.getEmployeeResponsesByRole(email, role);
        
    }

    @PostMapping
    public User addEmployee(
            @RequestBody EmployeeRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        return employeeService.addEmployee(request, email, role);
    }

    @PutMapping("/{userId}")
    public User updateEmployee(
            @PathVariable Long userId,
            @RequestBody EmployeeRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        return employeeService.updateEmployee(userId, request, email, role);
    }

    @DeleteMapping("/{userId}")
    public void deleteEmployee(
            @PathVariable Long userId,
            Authentication authentication
    ) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        employeeService.deleteEmployee(userId, role);
    }
}