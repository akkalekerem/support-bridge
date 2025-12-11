package com.supportbridge.backend.service;

import com.supportbridge.backend.dto.CreateAppointmentRequest;
import com.supportbridge.backend.entity.*;
import com.supportbridge.backend.repository.AppointmentRepository;
import com.supportbridge.backend.repository.EventRepository;
import com.supportbridge.backend.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final EventRepository eventRepository;
    private final VolunteerRepository volunteerRepository;

    // 1. BAŞVURU YAPMA (Gönüllü)
    public void createAppointment(CreateAppointmentRequest request) {
        // Etkinlik var mı?
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı!"));

        // Gönüllü var mı?
        Volunteer volunteer = volunteerRepository.findById(request.getVolunteerId())
                .orElseThrow(() -> new RuntimeException("Gönüllü bulunamadı!"));

        // Kontrol: Etkinlik onaylı mı? (Admin onayı yoksa başvurulamaz)
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException("Bu etkinlik henüz onaylanmamış veya aktif değil!");
        }

        // Yeni Başvuru Oluştur
        Appointment appointment = new Appointment();
        appointment.setEvent(event);
        appointment.setVolunteer(volunteer);
        appointment.setStatus(AppointmentStatus.PENDING); // Talep edenin onayını bekliyor

        appointmentRepository.save(appointment);
    }

    // 2. BAŞVURU ONAYLA/REDDET (Talep Eden)
    public void respondToAppointment(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı!"));

        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }

    // 3. BİR ETKİNLİĞE GELEN BAŞVURULARI LİSTELE
    public List<Appointment> getRequestsForEvent(Long eventId) {
        return appointmentRepository.findByEventId(eventId);
    }
}