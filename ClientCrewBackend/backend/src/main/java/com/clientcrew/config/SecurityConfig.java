package com.clientcrew.config;


// Spring
import org.springframework.context.annotation.Bean;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Configuration;

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

import java.util.List;

// Security + Service
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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // Allow preflight (CORS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Auth APIs
                .requestMatchers("/api/auth/**").permitAll()

                // Role-based base APIs
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("/api/employee/**").hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")
                .requestMatchers("/api/customer/**").hasAnyRole("ADMIN", "CUSTOMER")

                // =======================
                // PROJECTS (FINAL RULES)
                // =======================

                // View → All roles
                .requestMatchers(HttpMethod.GET, "/api/projects/**")
                    .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER")

                // Create → Admin + Manager
                .requestMatchers(HttpMethod.POST, "/api/projects/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Update → Admin + Manager (ownership check in service layer)
                .requestMatchers(HttpMethod.PUT, "/api/projects/**")
                    .hasAnyRole("ADMIN", "MANAGER")

                // Delete → ONLY Admin
                .requestMatchers(HttpMethod.DELETE, "/api/projects/**")
                    .hasRole("ADMIN")

                 // Users (dropdowns etc.)
                    .requestMatchers(HttpMethod.GET, "/api/users", "/api/users/**")
                        .hasAnyRole("ADMIN", "MANAGER")
                        
                        
                        
                     // CUSTOMERS PAGE
                        .requestMatchers(HttpMethod.GET, "/api/customers/**")
                            .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                        .requestMatchers(HttpMethod.POST, "/api/customers/**")
                            .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.PUT, "/api/customers/**")
                            .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.DELETE, "/api/customers/**")
                            .hasRole("ADMIN")

                // Everything else
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
//    if(user.getPassword().equals(inputPassword)) {
//        // login success
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}