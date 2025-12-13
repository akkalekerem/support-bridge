package com.supportbridge.backend.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long senderId;      // Mesajı atan kim?
    private Long receiverId;    // Kime gidiyor?
    private Long appointmentId; // Hangi randevunun sohbeti?
    private String content;     // Mesaj ne?
}