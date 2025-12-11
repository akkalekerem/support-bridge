package com.supportbridge.backend.dto;

import com.supportbridge.backend.entity.EventCategory;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateEventRequest {
    private String title;           // Başlık
    private String description;     // Açıklama
    private EventCategory category; // SUPPORT (Destek) veya CELEBRATION (Kutlama)
    private String subType;         // Alt tip (Örn: Moral Ziyareti)
    private LocalDateTime dateTime; // Ne zaman? (Format: 2025-12-20T14:00:00)
    private String city;
    private String address;
    private int quota;              // Kaç gönüllü lazım?

    // Normalde bu bilgi token'dan alınır ama şimdilik test için elden gireceğiz
    private Long requesterId;       // Etkinliği kim oluşturuyor?
}