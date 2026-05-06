//Used when backend sends login response to frontend.


package com.clientcrew.dto;

public class AuthResponse {

    private String token;
    private String userEmail;
    private String userRole;
    private String userFullName;

    public AuthResponse() {
    }

    public AuthResponse(String token, String userEmail, String userRole, String userFullName) {
        this.token = token;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.userFullName = userFullName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }
}