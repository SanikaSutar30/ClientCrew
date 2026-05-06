//Used when frontend sends registration data.

package com.clientcrew.dto;

import com.clientcrew.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String userFullName;

    @Email(message = "Enter valid email")
    @NotBlank(message = "Email is required")
    private String userEmail;

    @NotBlank(message = "Password is required")
    private String userPassword;

    @NotNull(message = "Role is required")
    private Role userRole;

    
    private String userImage;
    
    public RegisterRequest() {
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public Role getUserRole() {
        return userRole;
    }

    public void setUserRole(Role userRole) {
        this.userRole = userRole;
    }
    
    public String getUserImage() {
        return userImage;
    }

    public void setUserImage(String userImage) {
        this.userImage = userImage;
    }
}