package com.supportbridge.backend.repository;

import com.supportbridge.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Bir kullanıcıya ait bildirimleri, en yeniden eskiye doğru getir
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Okunmamış bildirim sayısı (Zil üzerindeki kırmızı sayı için)
    long countByUserIdAndIsReadFalse(Long userId);
}