package com.supportbridge.backend.entity;

public enum VerificationStatus {
    PENDING,    // Onay Bekliyor (Belge yüklendi, admin bakacak)
    APPROVED,   // Onaylandı
    REJECTED    // Reddedildi
}