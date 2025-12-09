package com.supportbridge.backend.repository;
import com.supportbridge.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // Bir randevuya ait mesajları getir (Eskiden yeniye doğru)
    List<Message> findByAppointmentIdOrderBySentAtAsc(Long appointmentId);
}