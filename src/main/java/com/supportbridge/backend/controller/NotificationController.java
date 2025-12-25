package com.supportbridge.backend.controller;

import com.supportbridge.backend.entity.Notification;
import com.supportbridge.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin
public class NotificationController {

    private final NotificationService notificationService;

    // Bildirimleri Listele
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getMyNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getMyNotifications(userId));
    }

    // Okunmamış Sayısı
    @GetMapping("/{userId}/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    // Hepsini Okundu Yap
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<Void> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}