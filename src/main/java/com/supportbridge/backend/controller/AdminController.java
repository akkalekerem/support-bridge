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
public class AdminController {

    private final EventService eventService;

    // ETKİNLİK ONAYLA (PUT)
    // Adres: http://localhost:8080/api/admin/events/1/approve
    @PutMapping("/events/{eventId}/approve")
    public ResponseEntity<String> approveEvent(@PathVariable Long eventId) {
        eventService.updateEventStatus(eventId, EventStatus.APPROVED);
        return ResponseEntity.ok("Etkinlik onaylandı ve yayına alındı.");
    }

    // ETKİNLİK REDDET (PUT)
    // Adres: http://localhost:8080/api/admin/events/1/reject
    @PutMapping("/events/{eventId}/reject")
    public ResponseEntity<String> rejectEvent(@PathVariable Long eventId) {
        eventService.updateEventStatus(eventId, EventStatus.REJECTED);
        return ResponseEntity.ok("Etkinlik reddedildi.");
    }

    // BEKLEYENLERİ LİSTELE (GET)
    // URL: http://localhost:8080/api/admin/events/pending
    @GetMapping("/events/pending")
    public ResponseEntity<List<Event>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getPendingEvents());
    }
}