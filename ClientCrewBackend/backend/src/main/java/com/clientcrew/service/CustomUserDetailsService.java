//Spring Security needs a way to load user from DB.
//
//This file tells Spring:
//
//“when login happens, find user by email and give Spring the user details.”


package com.clientcrew.service;



import java.util.Collections;
import java.util.Optional;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.clientcrew.entity.User;
import com.clientcrew.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {

        Optional<User> optionalUser = userRepository.findByUserEmail(userEmail);

        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + userEmail);
        }

        User user = optionalUser.get();

        return new org.springframework.security.core.userdetails.User(
                user.getUserEmail(),
                user.getUserPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name())
                )
        );
    }
    
    
    
    
}