package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000) // Mesaj içeriği
    private String content;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    // İLİŞKİ 1: Mesaj hangi randevu/sohbet içinde atıldı?
    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    // İLİŞKİ 2: Mesajı kim attı? (User tablosuna bağlanır)
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @PrePersist
    protected void onCreate() {
        this.sentAt = LocalDateTime.now();
    }
}