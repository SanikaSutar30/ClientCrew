//Actual business logic.

//This file does:
//register user
//encode password
//authenticate login
//generate JWT
//return AuthResponse

//This is the main auth brain.

package com.clientcrew.service.impl;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.clientcrew.dto.AuthResponse;
import com.clientcrew.dto.LoginRequest;
import com.clientcrew.dto.RegisterRequest;
import com.clientcrew.entity.User;
import com.clientcrew.repository.UserRepository;
import com.clientcrew.security.JwtUtil;
import com.clientcrew.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse registerUser(RegisterRequest registerRequest) {

        if (userRepository.existsByUserEmail(registerRequest.getUserEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUserFullName(registerRequest.getUserFullName());
        user.setUserEmail(registerRequest.getUserEmail());
        user.setUserPassword(passwordEncoder.encode(registerRequest.getUserPassword()));
        user.setUserRole(registerRequest.getUserRole());
        user.setUserImage(registerRequest.getUserImage());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUserEmail(), user.getUserRole().name());

        return new AuthResponse(
                token,
                user.getUserEmail(),
                user.getUserRole().name(),
                user.getUserFullName()
        );
    }

    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUserEmail(),
                        loginRequest.getUserPassword()
                )
        );

        Optional<User> optionalUser = userRepository.findByUserEmail(loginRequest.getUserEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        String token = jwtUtil.generateToken(user.getUserEmail(), user.getUserRole().name());

        return new AuthResponse(
                token,
                user.getUserEmail(),
                user.getUserRole().name(),
                user.getUserFullName()
        );
    }
}