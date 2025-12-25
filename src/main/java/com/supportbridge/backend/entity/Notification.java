package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Bildirimin kime gideceği (User ID)

    private String message; // Mesaj içeriği (Örn: "Başvurunuz onaylandı!")

    private boolean isRead = false; // Okundu mu?

    private String type; // INFO, SUCCESS, WARNING, ERROR

    @CreationTimestamp
    private LocalDateTime createdAt;
}