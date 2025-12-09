package com.supportbridge.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Şifreleri güvenli bir şekilde şifrelemek (hashlemek) için gerekli araç
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Güvenlik Duvarı Ayarları
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Test yaparken hata almamak için kapattık
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/**").permitAll() // ŞİMDİLİK tüm sayfalara ve API'lere herkes erişebilsin (Geliştirme aşaması)
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}