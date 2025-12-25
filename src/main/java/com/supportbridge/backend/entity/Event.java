package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private LocalDateTime dateTime;

    private String city;
    private String address;

    private int quota;

    // 🔥 DEĞİŞİKLİK BURADA: 'boolean' yerine 'Boolean' yaptık.
    // Artık NULL gelirse hata vermez, kabul eder.
    @Column(name = "show_phone_number")
    private Boolean showPhoneNumber = false;

    @Enumerated(EnumType.STRING)
    private EventCategory category;

    private String subType;

    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private Requester requester;

    @CreationTimestamp
    private LocalDateTime createdAt;
}