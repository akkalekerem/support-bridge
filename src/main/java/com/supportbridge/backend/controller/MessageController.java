package com.supportbridge.backend.controller;

import com.supportbridge.backend.dto.SendMessageRequest;
import com.supportbridge.backend.entity.Appointment;
import com.supportbridge.backend.entity.Message;
import com.supportbridge.backend.entity.User;
import com.supportbridge.backend.repository.AppointmentRepository;
import com.supportbridge.backend.repository.MessageRepository;
import com.supportbridge.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin
public class MessageController {

    private final MessageRepository messageRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @PostMapping
    public Message sendMessage(@RequestBody SendMessageRequest request) {
        // 1. Randevuyu Bul
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı!"));

        // 2. Gönderen Kişiyi Bul (User Nesnesi Lazım)
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        // 3. Mesajı Hazırla
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(sender);          // Entity'de 'User sender' var
        message.setAppointment(appointment); // Entity'de 'Appointment appointment' var

        // setSentAt dememize gerek yok çünkü Entity içinde @PrePersist var.
        // Veritabanına kaydedilirken otomatik şu anki zamanı basacak.
        // Ama manuel vermek istersen: message.setSentAt(LocalDateTime.now());

        // Receiver alanını sildik çünkü senin Entity'nde yok.

        return messageRepository.save(message);
    }

    @GetMapping("/{appointmentId}")
    public List<Message> getMessages(@PathVariable Long appointmentId) {
        // Yeni düzelttiğimiz Repository metodunu çağırıyoruz
        return messageRepository.findByAppointmentIdOrderBySentAtAsc(appointmentId);
    }
}