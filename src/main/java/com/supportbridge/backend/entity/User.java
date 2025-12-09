package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // Veritabanında tablonun adı 'users' olacak
@Data // Getter, Setter ve toString metodlarını otomatik oluşturur (Lombok)
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED) // KRİTİK NOKTA: Diğer sınıflar buna bağlanacak
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // Email boş olamaz ve benzersiz olmalı
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName; // İsim Soyisim

    private String phoneNumber; // Telefon Numarası

    @Enumerated(EnumType.STRING)
    private Role role; // Az önce oluşturduğumuz Rol (ADMIN, VOLUNTEER vs.)

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Kayıt anında o anki tarihi otomatik atar
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}