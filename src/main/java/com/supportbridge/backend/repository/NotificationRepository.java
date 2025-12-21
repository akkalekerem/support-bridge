package com.supportbridge.backend.repository;

import com.supportbridge.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Kullanıcının bildirimlerini tarihe göre (yeni en üstte) getir
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Okunmamış bildirim sayısı için (İsteğe bağlı)
    long countByUserIdAndIsReadFalse(Long userId);
}
