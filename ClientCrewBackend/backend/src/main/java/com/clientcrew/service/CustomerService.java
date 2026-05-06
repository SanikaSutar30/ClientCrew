package com.clientcrew.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clientcrew.entity.Project;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(UserRepository userRepository,
            ProjectRepository projectRepository,
            PasswordEncoder passwordEncoder) {
this.userRepository = userRepository;
this.projectRepository = projectRepository;
this.passwordEncoder = passwordEncoder;
}

    public List<User> getCustomersByRole(String email, String role) {

        if (role.equals("ADMIN")) {
            return userRepository.findByUserRole(Role.CUSTOMER);
        }

        if (role.equals("MANAGER") || role.equals("EMPLOYEE")) {
            List<Project> projects =
                    projectRepository.findByAssignedEmployees_UserEmail(email);

            List<String> customerEmails = projects.stream()
                    .map(Project::getCustomerEmail)
                    .filter(customerEmail -> customerEmail != null && !customerEmail.isBlank())
                    .distinct()
                    .toList();

            return customerEmails.stream()
                    .map(customerEmail -> userRepository.findByUserEmail(customerEmail).orElse(null))
                    .filter(customer -> customer != null && customer.getUserRole() == Role.CUSTOMER)
                    .toList();
        }

        throw new RuntimeException("Access denied: Customers page not allowed");
    }
    
    public User addCustomer(User customer, String role) {
        if (!role.equals("ADMIN") && !role.equals("MANAGER")) {
            throw new RuntimeException("Access denied");
        }

        customer.setUserRole(Role.CUSTOMER);

        if (customer.getUserPassword() == null || customer.getUserPassword().isBlank()) {
            customer.setUserPassword(passwordEncoder.encode("Customer@123"));
        } else {
            customer.setUserPassword(passwordEncoder.encode(customer.getUserPassword()));
        }

        return userRepository.save(customer);
    }
}