
//Interface for auth logic.

package com.clientcrew.service;

import com.clientcrew.dto.AuthResponse;
import com.clientcrew.dto.LoginRequest;
import com.clientcrew.dto.RegisterRequest;

public interface AuthService {

    AuthResponse registerUser(RegisterRequest registerRequest);

    AuthResponse loginUser(LoginRequest loginRequest);
}