package com.supportbridge.backend.controller;

import com.supportbridge.backend.entity.Event;
import com.supportbridge.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Frontend erişim izni
public class EventController {

    private final EventService eventService;

    // 1. ETKİNLİK OLUŞTUR (POST)
    // URL: http://localhost:8080/api/events?requesterId=5
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestParam Long requesterId, @RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(requesterId, event));
    }

    // 2. TÜM ONAYLI ETKİNLİKLERİ GETİR (Gönüllüler için)
    @GetMapping
    public ResponseEntity<List<Event>> getAllApprovedEvents() {
        return ResponseEntity.ok(eventService.getAllApprovedEvents());
    }

    // 3. TALEP EDENİN KENDİ ETKİNLİKLERİNİ GETİR
    @GetMapping("/requester/{requesterId}")
    public ResponseEntity<List<Event>> getEventsByRequester(@PathVariable Long requesterId) {
        return ResponseEntity.ok(eventService.getEventsByRequester(requesterId));
    }

    // 4. KATEGORİYE GÖRE GETİR (Opsiyonel)
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable String category) {
        // Enum dönüşümü servis içinde halledilmeli veya string olarak aranmalı
        // Şimdilik basit tutuyoruz
        return ResponseEntity.ok(eventService.getAllApprovedEvents());
    }
}