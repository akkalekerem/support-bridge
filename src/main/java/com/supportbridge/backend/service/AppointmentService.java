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

    // 1. BAŞVURU OLUŞTUR
    public void createAppointment(CreateAppointmentRequest request) {
        // A. Etkinlik Var mı?
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı!"));

        // B. Gönüllü Var mı?
        Volunteer volunteer = volunteerRepository.findById(request.getVolunteerId())
                .orElseThrow(() -> new RuntimeException("Gönüllü bulunamadı!"));

        // C. KONTROL: Etkinlik onaylı mı? (Senin eklediğin harika kontrol ⭐)
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException("Bu etkinlik henüz onaylanmamış veya aktif değil!");
        }

        // D. KONTROL: Zaten başvurmuş mu? (Benim eklediğim güvenlik önlemi 🛡️)
        boolean alreadyApplied = appointmentRepository.findAll().stream()
                .anyMatch(a -> a.getEvent().getId().equals(event.getId()) &&
                        a.getVolunteer().getId().equals(volunteer.getId()));

        if (alreadyApplied) {
            throw new RuntimeException("Bu etkinliğe zaten başvurdunuz. Sonuç bekleyiniz.");
        }

        // E. Kayıt
        Appointment appointment = new Appointment();
        appointment.setEvent(event);
        appointment.setVolunteer(volunteer);
        appointment.setStatus(AppointmentStatus.PENDING);

        // createdAt ve appliedAt @PrePersist ile otomatik dolacak

        appointmentRepository.save(appointment);
    }

    // 2. ETKİNLİĞE GELEN BAŞVURULARI LİSTELE
    public List<Appointment> getRequestsForEvent(Long eventId) {
        return appointmentRepository.findByEventId(eventId);
    }

    // 3. GÖNÜLLÜNÜN BAŞVURULARINI LİSTELE
    public List<Appointment> getAppointmentsForVolunteer(Long volunteerId) {
        return appointmentRepository.findByVolunteerId(volunteerId);
    }

    // 4. BAŞVURUYA CEVAP VER (Hem Onay Hem Ret İçin Ortak Metot)
    // Controller'da yazdığımız 'approve' ve 'reject' metodları bunu kullanacak.
    public void respondToAppointment(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı!"));

        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }
}