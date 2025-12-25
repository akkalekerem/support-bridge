package com.supportbridge.backend.dto;

import com.supportbridge.backend.entity.EventCategory;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String city;
    private String address;

    // Kontenjan (Artık bu da geliyor)
    private int quota;

    // 🔥 EKSİK OLAN KISIM BURASIYDI:
    private boolean showPhoneNumber;

    private EventCategory category;
    private String subType;
}