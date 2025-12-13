package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // İLİŞKİ 1: Başvuruyu hangi Gönüllü yapıyor?
    @ManyToOne
    @JoinColumn(name = "volunteer_id", nullable = false)
    private Volunteer volunteer;

    // İLİŞKİ 2: Hangi Etkinliğe başvuruyor?
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt; // Başvuru Tarihi

    // TEK BİR METOT İÇİNDE HEPSİNİ YAPIYORUZ
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.appliedAt = now; // İkisi de aynı zaman

        if (this.status == null) {
            this.status = AppointmentStatus.PENDING; // İlk oluştuğunda 'Bekliyor' olsun
        }
    }
}