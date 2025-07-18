package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource; // Import this
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Import this
import org.springframework.web.cors.CorsConfiguration; // Import this
import java.util.Arrays; // Import this

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS for Spring Security
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/verify-firebase-token").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    // Define a CorsConfigurationSource bean for Spring Security
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Set allowed origins to match your frontend URL(s)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*")); // Allow all headers or specify
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Max age for pre-flight cache

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply this CORS config to all paths
        return source;
    }
}