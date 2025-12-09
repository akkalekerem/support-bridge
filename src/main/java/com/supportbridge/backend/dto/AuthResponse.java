package com.supportbridge.backend.dto;

import com.supportbridge.backend.entity.Role;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private Role role;
    private String message;
}