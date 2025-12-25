package com.supportbridge.backend.service;

import com.supportbridge.backend.entity.Notification;
import com.supportbridge.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // 1. BİLDİRİM GÖNDER (Sistem içinden çağıracağız)
    public void sendNotification(Long userId, String message, String type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);
    }

    // 2. KULLANICININ BİLDİRİMLERİNİ GETİR
    public List<Notification> getMyNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // 3. OKUNMAMIŞ SAYISINI GETİR
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    // 4. HEPSİNİ OKUNDU YAP (Zile basınca)
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}