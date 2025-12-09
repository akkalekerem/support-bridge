package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "requesters")
@Data
@EqualsAndHashCode(callSuper = true) // User sınıfının özelliklerini de (ID, email) eşitlik kontrolüne katar
@PrimaryKeyJoinColumn(name = "user_id") // User tablosuna ID ile bağlanır
public class Requester extends User {

    // Onay durumu (Bekliyor, Onaylandı vs.)
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    // Dokümanda VerificationRequest içinde geçiyor, pratik olsun diye buraya ekledik.
    @Column(name = "document_path")
    private String documentPath;

    // Sınıf ilk oluştuğunda durumu 'Bekliyor' olsun
    public Requester() {
        this.verificationStatus = VerificationStatus.PENDING;
    }
}