package com.supportbridge.backend.entity;

public enum AppointmentStatus {
    PENDING,    // Talep Eden'in onayı bekleniyor
    APPROVED,   // Talep Eden onayladı, randevu kesinleşti
    REJECTED,   // Talep Eden reddetti
    CANCELLED,  // Gönüllü iptal etti
    COMPLETED   // Etkinlik gerçekleşti ve tamamlandı
}