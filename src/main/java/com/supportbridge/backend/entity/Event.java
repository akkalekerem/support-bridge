package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // Başlık: "Huzurevi Ziyareti"

    @Column(length = 1000) // Açıklama uzun olabilir
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventCategory category; // Destek veya Kutlama

    @Column(nullable = false)
    private String subType; // Alt Tip: "Moral Ziyareti", "Doğum Günü" vb.

    @Column(nullable = false)
    private LocalDateTime dateTime; // Etkinlik ne zaman?

    @Column(nullable = false)
    private String city; // Hangi şehirde?

    @Column(nullable = false)
    private String address; // Açık adres

    @Column(nullable = false)
    private int quota; // Kaç gönüllü lazım?

    @Enumerated(EnumType.STRING)
    private EventStatus status; // Şu anki durumu

    // İLİŞKİ: Bir etkinliği bir 'Requester' (Talep Eden) oluşturur
    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private Requester requester;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Etkinlik ilk oluştuğunda otomatik çalışır
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        // Varsayılan olarak admin onayı beklesin
        if (this.status == null) {
            this.status = EventStatus.PENDING;
        }
    }
}