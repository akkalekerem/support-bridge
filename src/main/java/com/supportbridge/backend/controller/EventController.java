package com.supportbridge.backend.controller;

import com.supportbridge.backend.dto.CreateEventRequest;
import com.supportbridge.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // ETKİNLİK OLUŞTURMA (POST)
    // Adres: http://localhost:8080/api/events/create
    @PostMapping("/create")
    public ResponseEntity<String> createEvent(@RequestBody CreateEventRequest request) {
        eventService.createEvent(request);
        return ResponseEntity.ok("Etkinlik başarıyla oluşturuldu ve admin onayına gönderildi.");
    }
}