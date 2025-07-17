package com.example.demo.config;
// SecurityConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // This annotation enables Spring Security's web security features
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API endpoints (common for REST APIs)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/verify-firebase-token").permitAll() // Allow unauthenticated access to your Firebase verification endpoint
                .anyRequest().authenticated() // All other requests require authentication
            );
        return http.build();
    }
}