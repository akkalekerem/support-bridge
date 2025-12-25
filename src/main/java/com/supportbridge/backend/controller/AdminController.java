package com.supportbridge.backend.controller;

import com.supportbridge.backend.entity.Event;
import com.supportbridge.backend.entity.EventStatus;
import com.supportbridge.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin // 🔥 BU EKSİKTİ! Bunu eklemezsen React buraya erişemez.
public class AdminController {

    private final EventService eventService;

    // ETKİNLİK ONAYLA
    @PutMapping("/events/{eventId}/approve")
    public ResponseEntity<String> approveEvent(@PathVariable Long eventId) {
        eventService.updateEventStatus(eventId, EventStatus.APPROVED);
        return ResponseEntity.ok("Etkinlik onaylandı ve yayına alındı.");
    }

    // ETKİNLİK REDDET
    @PutMapping("/events/{eventId}/reject")
    public ResponseEntity<String> rejectEvent(@PathVariable Long eventId) {
        eventService.updateEventStatus(eventId, EventStatus.REJECTED);
        return ResponseEntity.ok("Etkinlik reddedildi.");
    }

    // BEKLEYENLERİ LİSTELE
    @GetMapping("/events/pending")
    public ResponseEntity<List<Event>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getPendingEvents());
    }
}