package com.supportbridge.backend.dto; // Paket ismine dikkat et

import com.supportbridge.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor // Dolu constructor (Tüm alanlar)
@NoArgsConstructor  // BOŞ CONSTRUCTOR (Hatanın çözümü bu!)
public class AuthResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;          // Yeni
    private String phoneNumber;    // Yeni
    private Role role;
    private String message;

    private String experienceNote; // Gönüllü için
    private String documentPath;   // Talep Eden için
}