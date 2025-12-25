package com.supportbridge.backend.controller;

import com.supportbridge.backend.dto.CreateEventRequest;
import com.supportbridge.backend.entity.Event;
import com.supportbridge.backend.entity.EventStatus; // 🔥 Bu import önemli
import com.supportbridge.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin
public class EventController {

    private final EventService eventService;

    // Tüm Etkinlikleri Getir (Admin ve Liste için)
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Talep Edenin Kendi Etkinlikleri
    @GetMapping("/requester/{id}")
    public List<Event> getMyEvents(@PathVariable Long id) {
        return eventService.getEventsByRequester(id);
    }

    // Yeni Etkinlik Ekle
    @PostMapping
    public Event createEvent(@RequestParam Long requesterId, @RequestBody CreateEventRequest request) {
        return eventService.createEvent(requesterId, request);
    }

    // 🔥 DÜZELTME BURADA: approveEvent yerine updateEventStatus kullanıyoruz
    @PutMapping("/{id}/approve")
    public void approveEvent(@PathVariable Long id) {
        eventService.updateEventStatus(id, EventStatus.APPROVED);
    }

    // Etkinliği Sil/Reddet (Admin)
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}