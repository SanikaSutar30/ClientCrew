//Used when frontend sends login email/password.



package com.clientcrew.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @Email(message = "Enter valid email")
    @NotBlank(message = "Email is required")
    private String userEmail;

    @NotBlank(message = "Password is required")
    private String userPassword;

    public LoginRequest() {
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
}