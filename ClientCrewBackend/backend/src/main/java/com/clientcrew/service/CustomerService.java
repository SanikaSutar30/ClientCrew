package com.clientcrew.service;

import java.util.List;


import org.springframework.stereotype.Service;

import com.clientcrew.entity.Project;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.clientcrew.dto.CustomerRequest;
import com.clientcrew.entity.ActivityType;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    public CustomerService(UserRepository userRepository,
            ProjectRepository projectRepository,
            PasswordEncoder passwordEncoder,
            ActivityLogService activityLogService) {
this.userRepository = userRepository;
this.projectRepository = projectRepository;
this.passwordEncoder = passwordEncoder;
this.activityLogService = activityLogService;
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
    
    public User addCustomer(CustomerRequest request, String role, String loggedInEmail) {
        if (!role.equals("ADMIN") && !role.equals("MANAGER")) {
            throw new RuntimeException("Access denied");
        }

        if (userRepository.existsByUserEmail(request.getUserEmail())) {
            throw new RuntimeException("Customer email already exists");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (role.equals("MANAGER")) {
            boolean isManagerAssigned = project.getAssignedEmployees()
                    .stream()
                    .anyMatch(user ->
                            user.getUserEmail().equals(loggedInEmail)
                            && user.getUserRole().name().equals("MANAGER")
                    );

            if (!isManagerAssigned) {
                throw new RuntimeException("Access denied: You can assign customer only to your project");
            }
        }

        User customer = new User();
        customer.setUserFullName(request.getUserFullName());
        customer.setUserEmail(request.getUserEmail());
        customer.setUserImage(request.getUserImage());
        customer.setUserRole(Role.CUSTOMER);
        customer.setUserPassword(passwordEncoder.encode("123456"));
        customer.setUserPhone(request.getUserPhone());
        customer.setStatus(request.getStatus());
        customer.setJoinedDate(request.getJoinedDate());

        User savedCustomer = userRepository.save(customer);

        project.setCustomerEmail(savedCustomer.getUserEmail());
        project.setClientName(savedCustomer.getUserFullName());
        projectRepository.save(project);
        
        User performedBy = userRepository.findByUserEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        activityLogService.createActivity(
                ActivityType.CUSTOMER_CREATED,
                "CUSTOMER",
                savedCustomer.getUserId(),
                savedCustomer.getUserFullName(),
                "Customer Created",
                performedBy.getUserFullName() + " created customer " + savedCustomer.getUserFullName(),
                null,
                savedCustomer.getUserEmail(),
                performedBy,
                project.getManagerEmail(),
                savedCustomer.getUserEmail(),
                savedCustomer.getUserEmail()
        );

        return savedCustomer;
    }
    
    public User updateCustomer(Long id, CustomerRequest request, String role, String loggedInEmail) {
        if (!role.equals("ADMIN") && !role.equals("MANAGER")) {
            throw new RuntimeException("Access denied");
        }

        User existingCustomer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (existingCustomer.getUserRole() != Role.CUSTOMER) {
            throw new RuntimeException("User is not a customer");
        }

        if (role.equals("MANAGER")) {
            List<Project> managerProjects =
                    projectRepository.findByAssignedEmployees_UserEmail(loggedInEmail);

            boolean canEditCustomer = managerProjects.stream()
                    .anyMatch(project ->
                            project.getCustomerEmail() != null
                            && project.getCustomerEmail().equals(existingCustomer.getUserEmail())
                    );

            if (!canEditCustomer) {
                throw new RuntimeException("Access denied: You can edit only your project customers");
            }
        }

        existingCustomer.setUserFullName(request.getUserFullName());
        existingCustomer.setUserPhone(request.getUserPhone());
        existingCustomer.setStatus(request.getStatus());
        existingCustomer.setJoinedDate(request.getJoinedDate());
        existingCustomer.setUserImage(request.getUserImage());

        User updatedCustomer = userRepository.save(existingCustomer);
        String oldName = existingCustomer.getUserFullName();
        String oldStatus = existingCustomer.getStatus();
        
        List<Project> linkedProjects =
                projectRepository.findByCustomerEmail(existingCustomer.getUserEmail());

        linkedProjects.forEach(project -> {
            project.setClientName(updatedCustomer.getUserFullName());
            projectRepository.save(project);
        });

        
        User performedBy = userRepository.findByUserEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        String description = performedBy.getUserFullName()
                + " updated customer " + oldName;

        if (!oldName.equalsIgnoreCase(updatedCustomer.getUserFullName())) {
            description += " to " + updatedCustomer.getUserFullName();
        }

        if (oldStatus != null && updatedCustomer.getStatus() != null
                && !oldStatus.equalsIgnoreCase(updatedCustomer.getStatus())) {
            description += " | Status: " + oldStatus + " → " + updatedCustomer.getStatus();
        }

        String managerEmail = linkedProjects.isEmpty() ? null : linkedProjects.get(0).getManagerEmail();

        activityLogService.createActivity(
                ActivityType.CUSTOMER_UPDATED,
                "CUSTOMER",
                updatedCustomer.getUserId(),
                updatedCustomer.getUserFullName(),
                "Customer Updated",
                description,
                oldName,
                updatedCustomer.getUserFullName(),
                performedBy,
                managerEmail,
                updatedCustomer.getUserEmail(),
                updatedCustomer.getUserEmail()
        );
        
        return updatedCustomer;
    }
    
    
    public void deleteCustomer(Long id, String role, String loggedInEmail) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Only admin can delete customer");
        }

        User customer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getUserRole() != Role.CUSTOMER) {
            throw new RuntimeException("Only customer records can be deleted");
        }

        List<Project> linkedProjects = projectRepository.findByCustomerEmail(
                customer.getUserEmail()
        );

        linkedProjects.forEach(project -> {
            project.setCustomerEmail(null);
            project.setClientName(null);
        });

        projectRepository.saveAll(linkedProjects);
        
        User performedBy = userRepository.findByUserEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        String managerEmail = linkedProjects.isEmpty() ? null : linkedProjects.get(0).getManagerEmail();

        activityLogService.createActivity(
                ActivityType.CUSTOMER_DELETED,
                "CUSTOMER",
                customer.getUserId(),
                customer.getUserFullName(),
                "Customer Deleted",
                performedBy.getUserFullName() + " deleted customer " + customer.getUserFullName(),
                customer.getUserEmail(),
                null,
                performedBy,
                managerEmail,
                customer.getUserEmail(),
                customer.getUserEmail()
        );

        userRepository.delete(customer);
    }
    
    
}