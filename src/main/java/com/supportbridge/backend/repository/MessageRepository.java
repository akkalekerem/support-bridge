package com.supportbridge.backend.repository;

import com.supportbridge.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // ESKİSİ: findByAppointmentIdOrderByTimestampAsc (Hatalıydı)
    // YENİSİ: 'sentAt' alanına göre sıralıyoruz
    List<Message> findByAppointmentIdOrderBySentAtAsc(Long appointmentId);
}