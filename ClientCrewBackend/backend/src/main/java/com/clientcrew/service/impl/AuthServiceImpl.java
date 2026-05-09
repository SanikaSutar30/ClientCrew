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

import com.clientcrew.entity.ActivityType;
import com.clientcrew.service.ActivityLogService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final ActivityLogService activityLogService;

    public AuthServiceImpl(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            ActivityLogService activityLogService) {
this.userRepository = userRepository;
this.passwordEncoder = passwordEncoder;
this.jwtUtil = jwtUtil;
this.authenticationManager = authenticationManager;
this.activityLogService = activityLogService;
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

        User savedUser = userRepository.save(user);

        activityLogService.createActivity(
                ActivityType.USER_REGISTERED,
                "AUTH",
                savedUser.getUserId(),
                savedUser.getUserFullName(),
                "User Registered",
                savedUser.getUserFullName() + " registered as " + savedUser.getUserRole().name(),
                null,
                savedUser.getUserEmail(),
                savedUser,
                null,
                savedUser.getUserRole().name().equals("CUSTOMER") ? savedUser.getUserEmail() : null,
                savedUser.getUserEmail()
        );
        String token = jwtUtil.generateToken(savedUser.getUserEmail(), savedUser.getUserRole().name());
    return new AuthResponse(
                token,
                savedUser.getUserEmail(),
                savedUser.getUserRole().name(),
                savedUser.getUserFullName()
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
        activityLogService.createActivity(
                ActivityType.USER_LOGIN,
                "AUTH",
                user.getUserId(),
                user.getUserFullName(),
                "User Login",
                user.getUserFullName() + " logged in as " + user.getUserRole().name(),
                null,
                null,
                user,
                null,
                user.getUserRole().name().equals("CUSTOMER") ? user.getUserEmail() : null,
                user.getUserEmail()
        );

        String token = jwtUtil.generateToken(user.getUserEmail(), user.getUserRole().name());

        return new AuthResponse(
                token,
                user.getUserEmail(),
                user.getUserRole().name(),
                user.getUserFullName()
        );
    }
}