package com.supportbridge.backend.controller;

import com.supportbridge.backend.dto.CreateAppointmentRequest;
import com.supportbridge.backend.entity.Appointment;
import com.supportbridge.backend.entity.AppointmentStatus;
import com.supportbridge.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // BAŞVURU YAP (Gönüllü)
    // URL: http://localhost:8080/api/appointments/apply
    @PostMapping("/apply")
    public ResponseEntity<String> applyForEvent(@RequestBody CreateAppointmentRequest request) {
        appointmentService.createAppointment(request);
        return ResponseEntity.ok("Başvurunuz alındı, talep edenin onayı bekleniyor.");
    }

    // BAŞVURULARI LİSTELE (Talep Eden, kendi etkinliği için bakar)
    // URL: http://localhost:8080/api/appointments/event/1
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Appointment>> getAppointmentsForEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(appointmentService.getRequestsForEvent(eventId));
    }

    // BAŞVURU ONAYLA (Talep Eden)
    // URL: http://localhost:8080/api/appointments/5/approve
    @PutMapping("/{appointmentId}/approve")
    public ResponseEntity<String> approveAppointment(@PathVariable Long appointmentId) {
        appointmentService.respondToAppointment(appointmentId, AppointmentStatus.APPROVED);
        return ResponseEntity.ok("Gönüllü başvurusu onaylandı! İletişime geçebilirsiniz.");
    }

    // BAŞVURU REDDET (Talep Eden)
    // URL: http://localhost:8080/api/appointments/5/reject
    @PutMapping("/{appointmentId}/reject")
    public ResponseEntity<String> rejectAppointment(@PathVariable Long appointmentId) {
        appointmentService.respondToAppointment(appointmentId, AppointmentStatus.REJECTED);
        return ResponseEntity.ok("Başvuru reddedildi.");
    }

    // GÖNÜLLÜ BAŞVURULARINI LİSTELE (GET)
    // URL: http://localhost:8080/api/appointments/volunteer/1
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<Appointment>> getVolunteerAppointments(@PathVariable Long volunteerId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForVolunteer(volunteerId));
    }
}