package com.supportbridge.backend.controller;

import com.supportbridge.backend.dto.RegisterRequest;
import com.supportbridge.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Kullanıcı kaydı başarıyla oluşturuldu.");
    }

    // ... register metodu bittikten sonra ...

    @PostMapping("/login")
    public ResponseEntity<com.supportbridge.backend.dto.AuthResponse> login(@RequestBody com.supportbridge.backend.dto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}