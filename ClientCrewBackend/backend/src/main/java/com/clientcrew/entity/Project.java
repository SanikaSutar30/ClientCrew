package com.clientcrew.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;


@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectName;

    private String clientName;

    private LocalDate startDate;

    private LocalDate dueDate;

    private String status; // Planning, In Progress, Completed, On Hold

    private int progress;
    
    private String managerEmail;

    private String customerEmail;
    
    
    @ManyToMany
    @JoinTable(
        name = "project_employees",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<User> assignedEmployees = new ArrayList<>();

    // Constructors
    public Project() {}

    public Project(String projectName, String clientName, LocalDate startDate,
            LocalDate dueDate, String status, int progress,
            String managerEmail, String customerEmail) {
 this.projectName = projectName;
 this.clientName = clientName;
 this.startDate = startDate;
 this.dueDate = dueDate;
 this.status = status;
 this.progress = progress;
 this.managerEmail = managerEmail;
 this.customerEmail = customerEmail;
}

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

	public String getManagerEmail() {
		return managerEmail;
	}

	public void setManagerEmail(String managerEmail) {
		this.managerEmail = managerEmail;
	}


	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}
	
	public List<User> getAssignedEmployees() {
	    return assignedEmployees;
	}

	public void setAssignedEmployees(List<User> assignedEmployees) {
	    this.assignedEmployees = assignedEmployees;
	}

	

    
}