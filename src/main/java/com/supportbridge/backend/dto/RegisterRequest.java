package com.supportbridge.backend.dto;

import com.supportbridge.backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    // Tüm kullanıcılar için ortak alanlar
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private Role role; // Kullanıcı 'REQUESTER' mı 'VOLUNTEER' mi seçti?

    // Eğer 'Requester' (Talep Eden) ise bu alan dolu gelecek (Dosya yolu)
    private String documentPath;

    // Eğer 'Volunteer' (Gönüllü) ise bu alan dolu gelecek (Tecrübe notu)
    private String experienceNote;
}