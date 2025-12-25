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

    // 🔥 YENİ: Bildirim Servisini Bağladık
    private final NotificationService notificationService;

    // 1. BAŞVURU OLUŞTUR
    public void createAppointment(CreateAppointmentRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı!"));

        Volunteer volunteer = volunteerRepository.findById(request.getVolunteerId())
                .orElseThrow(() -> new RuntimeException("Gönüllü bulunamadı!"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException("Bu etkinlik henüz onaylanmamış veya aktif değil!");
        }

        boolean alreadyApplied = appointmentRepository.findByVolunteerId(volunteer.getId()).stream()
                .anyMatch(a -> a.getEvent().getId().equals(event.getId()));

        if (alreadyApplied) {
            throw new RuntimeException("Bu etkinliğe zaten başvurdunuz. Sonuç bekleyiniz.");
        }

        long approvedCount = appointmentRepository.findByEventId(event.getId()).stream()
                .filter(a -> a.getStatus() == AppointmentStatus.APPROVED)
                .count();

        if (event.getQuota() <= approvedCount) {
            throw new RuntimeException("Üzgünüz, bu etkinliğin kontenjanı dolmuştur! 😔");
        }

        Appointment appointment = new Appointment();
        appointment.setEvent(event);
        appointment.setVolunteer(volunteer);
        appointment.setStatus(AppointmentStatus.PENDING);

        appointmentRepository.save(appointment);

        // 🔥 BİLDİRİM: Talep Edene Haber Ver
        String message = "Yeni Başvuru! " + volunteer.getFirstName() + " " + volunteer.getLastName() +
                ", '" + event.getTitle() + "' etkinliğinize katılmak istiyor. 🙋‍♂️";
        notificationService.sendNotification(event.getRequester().getId(), message, "INFO");
    }

    // 2. LİSTELEME METOTLARI
    public List<Appointment> getRequestsForEvent(Long eventId) {
        return appointmentRepository.findByEventId(eventId);
    }

    public List<Appointment> getAppointmentsForVolunteer(Long volunteerId) {
        return appointmentRepository.findByVolunteerId(volunteerId);
    }

    // 3. BAŞVURUYA CEVAP VER (BİLDİRİMLİ 🔔)
    public void respondToAppointment(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı!"));

        if (status == AppointmentStatus.APPROVED) {
            long approvedCount = appointmentRepository.findByEventId(appointment.getEvent().getId()).stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.APPROVED)
                    .count();
            if (appointment.getEvent().getQuota() <= approvedCount) {
                throw new RuntimeException("Kontenjan doldu, daha fazla kişi onaylanamaz!");
            }
        }

        appointment.setStatus(status);
        appointmentRepository.save(appointment);

        // 🔥 BİLDİRİM: Gönüllüye Sonucu Bildir
        String message = status == AppointmentStatus.APPROVED
                ? "Tebrikler! '" + appointment.getEvent().getTitle() + "' etkinliği için başvurunuz ONAYLANDI! 🎒"
                : "Üzgünüz, '" + appointment.getEvent().getTitle() + "' etkinliği için başvurunuz reddedildi.";

        String type = status == AppointmentStatus.APPROVED ? "SUCCESS" : "WARNING";

        notificationService.sendNotification(appointment.getVolunteer().getId(), message, type);
    }
}