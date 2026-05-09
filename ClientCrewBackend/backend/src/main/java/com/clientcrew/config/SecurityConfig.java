package com.clientcrew.config;

// Spring Security configuration for JWT, CORS, and role-based API access

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.clientcrew.security.JwtAuthenticationFilter;
import com.clientcrew.service.CustomUserDetailsService;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors ->
                    cors.configurationSource(corsConfigurationSource())
            )
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()

                // Allow login/register APIs
                .requestMatchers("/api/auth/**")
                    .permitAll()

                // Users page APIs - Admin only
                .requestMatchers(HttpMethod.GET, "/api/users/all")
                    .hasRole("ADMIN")

                // Add user API - Admin only
                .requestMatchers(HttpMethod.POST, "/api/users")
                    .hasRole("ADMIN")

                // Edit user API - Admin only
                .requestMatchers(HttpMethod.PUT, "/api/users/**")
                    .hasRole("ADMIN")

                // Delete user API - Admin only
                .requestMatchers(HttpMethod.DELETE, "/api/users/**")
                    .hasRole("ADMIN")

                // Users dropdown APIs - Admin and Manager
                .requestMatchers(HttpMethod.GET, "/api/users", "/api/users/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Admin base APIs
                .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")

                // Manager base APIs
                .requestMatchers("/api/manager/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Employee base APIs
                .requestMatchers("/api/employee/**")
                    .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                // Customer base APIs
                .requestMatchers("/api/customer/**")
                    .hasAnyRole("ADMIN", "CUSTOMER")

                // Project view APIs - All roles
                .requestMatchers(HttpMethod.GET, "/api/projects/**")
                    .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER")

                // Project create APIs - Admin and Manager
                .requestMatchers(HttpMethod.POST, "/api/projects/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Project update APIs - Admin and Manager
                .requestMatchers(HttpMethod.PUT, "/api/projects/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Project delete APIs - Admin only
                .requestMatchers(HttpMethod.DELETE, "/api/projects/**")
                    .hasRole("ADMIN")

                // Customer view APIs - Admin, Manager, Employee
                .requestMatchers(HttpMethod.GET, "/api/customers/**")
                    .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                // Customer create APIs - Admin and Manager
                .requestMatchers(HttpMethod.POST, "/api/customers/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Customer update APIs - Admin and Manager
                .requestMatchers(HttpMethod.PUT, "/api/customers/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Customer delete APIs - Admin only
                .requestMatchers(HttpMethod.DELETE, "/api/customers/**")
                    .hasRole("ADMIN")

                    
                    
                 // Employee / Teams view APIs - All roles
                    .requestMatchers(HttpMethod.GET, "/api/employees/**")
                        .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER")

                    // Employee / Teams create APIs - Admin and Manager
                    .requestMatchers(HttpMethod.POST, "/api/employees/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                    // Employee / Teams update APIs - Admin and Manager
                    .requestMatchers(HttpMethod.PUT, "/api/employees/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                    // Employee / Teams delete APIs - Admin only
                    .requestMatchers(HttpMethod.DELETE, "/api/employees/**")
                        .hasRole("ADMIN")
                        
                        
                        
                     // Task view APIs - All roles
                        .requestMatchers(HttpMethod.GET, "/api/tasks/**")
                            .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER")

                        // Task create APIs - Admin and Manager
                        .requestMatchers(HttpMethod.POST, "/api/tasks/**")
                            .hasAnyRole("ADMIN", "MANAGER")

                        // Task update APIs - Admin and Manager
                        .requestMatchers(HttpMethod.PUT, "/api/tasks/**")
                            .hasAnyRole("ADMIN", "MANAGER")

                        // Task status update APIs - Admin, Manager, Employee
                        .requestMatchers(HttpMethod.PATCH, "/api/tasks/**")
                            .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                        // Task delete APIs - Admin only
                        .requestMatchers(HttpMethod.DELETE, "/api/tasks/**")
                            .hasRole("ADMIN")
                            
                            
                         // Reports APIs - All roles
                            .requestMatchers(HttpMethod.GET, "/api/reports/**")
                                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER")
                                
                                
                             // Activities APIs
                                .requestMatchers("/api/activities/**")
                                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER")      
                            
                        
                // All remaining APIs require login
                .anyRequest()
                    .authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(
                List.of("Authorization", "Content-Type")
        );
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }
}