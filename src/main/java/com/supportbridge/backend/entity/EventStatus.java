package com.supportbridge.backend.entity;

public enum EventStatus {
    PENDING,    // Admin onayı bekliyor
    APPROVED,   // Onaylandı ve yayında
    REJECTED,   // Reddedildi
    COMPLETED,  // Etkinlik yapıldı bitti
    FULL        // Kontenjan doldu
}