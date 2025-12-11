package com.supportbridge.backend.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long appointmentId; // Hangi sohbet?
    private Long senderId;      // Kim yazıyor?
    private String content;     // Mesaj ne?
}