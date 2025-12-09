package com.supportbridge.backend.repository;

import com.supportbridge.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Bir etkinliğe ait tüm başvuruları getir
    List<Appointment> findByEventId(Long eventId);

    // Bir gönüllünün kendi başvurularını getir
    List<Appointment> findByVolunteerId(Long volunteerId);
}