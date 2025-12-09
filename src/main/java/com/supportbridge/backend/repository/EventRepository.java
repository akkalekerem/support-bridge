package com.supportbridge.backend.repository;

import com.supportbridge.backend.entity.Event;
import com.supportbridge.backend.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    // Sadece belirli durumdaki etkinlikleri getir (Örn: Sadece APPROVED olanları)
    List<Event> findByStatus(EventStatus status);

    // Bir Talep Edenin kendi oluşturduğu etkinlikleri listelemesi için
    List<Event> findByRequesterId(Long requesterId);
}