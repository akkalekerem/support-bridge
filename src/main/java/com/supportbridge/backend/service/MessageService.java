package com.supportbridge.backend.service;

import com.supportbridge.backend.dto.SendMessageRequest;
import com.supportbridge.backend.entity.*;
import com.supportbridge.backend.repository.AppointmentRepository;
import com.supportbridge.backend.repository.MessageRepository;
import com.supportbridge.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    // MESAJ GÖNDER
    public void sendMessage(SendMessageRequest request) {
        // 1. Randevuyu bul
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı!"));

        // 2. Randevu onaylı mı? (Onaysızsa mesajlaşamazlar)
        if (appointment.getStatus() != AppointmentStatus.APPROVED) {
            throw new RuntimeException("Sadece onaylı randevularda mesajlaşılabilir!");
        }

        // 3. Göndereni bul
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        // 4. Mesajı oluştur ve kaydet
        Message message = new Message();
        message.setAppointment(appointment);
        message.setSender(sender);
        message.setContent(request.getContent());

        messageRepository.save(message);
    }

    // GEÇMİŞ MESAJLARI GETİR
    public List<Message> getMessages(Long appointmentId) {
        return messageRepository.findByAppointmentIdOrderBySentAtAsc(appointmentId);
    }
}