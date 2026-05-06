package com.clientcrew.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all customers for AddProject dropdown
    @GetMapping("/customers")
    public List<User> getCustomers() {
        return userRepository.findByUserRole(Role.CUSTOMER);
    }

    // Get all employees for AddProject dropdown
    @GetMapping("/employees")
    public List<User> getEmployees() {
        return userRepository.findByUserRole(Role.EMPLOYEE);
    }

    //Get all managers for AddProject dropdown
    @GetMapping("/managers")
    public List<User> getManagers() {
        return userRepository.findByUserRole(Role.MANAGER);
    }
 // Admin: get managers + employees for AddProject assign dropdown
    @GetMapping
    public List<User> getAssignableUsers() {
        List<User> managers = userRepository.findByUserRole(Role.MANAGER);
        List<User> employees = userRepository.findByUserRole(Role.EMPLOYEE);

        managers.addAll(employees);
        return managers;
    }
}