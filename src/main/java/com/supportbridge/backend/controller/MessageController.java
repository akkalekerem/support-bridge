package com.supportbridge.backend.controller;

import com.supportbridge.backend.dto.SendMessageRequest;
import com.supportbridge.backend.entity.Message;
import com.supportbridge.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // MESAJ GÖNDER (POST)
    // URL: http://localhost:8080/api/messages/send
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody SendMessageRequest request) {
        messageService.sendMessage(request);
        return ResponseEntity.ok("Mesaj gönderildi.");
    }

    // SOHBET GEÇMİŞİNİ GETİR (GET)
    // URL: http://localhost:8080/api/messages/appointment/1
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(messageService.getMessages(appointmentId));
    }
}