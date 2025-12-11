package com.supportbridge.backend.dto;

import lombok.Data;

@Data
public class CreateAppointmentRequest {
    private Long volunteerId; // Başvuran Gönüllünün ID'si
    private Long eventId;     // Başvurulan Etkinliğin ID'si
}