package com.supportbridge.backend.service;

import com.supportbridge.backend.dto.CreateEventRequest;
import com.supportbridge.backend.entity.Event;
import com.supportbridge.backend.entity.EventStatus;
import com.supportbridge.backend.entity.Requester;
import com.supportbridge.backend.repository.EventRepository;
import com.supportbridge.backend.repository.RequesterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RequesterRepository requesterRepository;

    // 🔥 YENİ: Bildirim Servisini Bağladık
    private final NotificationService notificationService;

    // 1. TÜM ETKİNLİKLERİ GETİR
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // 2. TALEP EDENİN KENDİ ETKİNLİKLERİ
    public List<Event> getEventsByRequester(Long requesterId) {
        return eventRepository.findByRequesterId(requesterId);
    }

    // 3. YENİ ETKİNLİK OLUŞTUR
    public Event createEvent(Long requesterId, CreateEventRequest request) {
        Requester requester = requesterRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDateTime(request.getDateTime());
        event.setCity(request.getCity());
        event.setAddress(request.getAddress());
        event.setCategory(request.getCategory());
        event.setSubType(request.getSubType());
        event.setQuota(request.getQuota());
        event.setShowPhoneNumber(request.isShowPhoneNumber());

        event.setRequester(requester);
        event.setStatus(EventStatus.PENDING);

        return eventRepository.save(event);
    }

    // 4. ETKİNLİK DURUMUNU GÜNCELLE (ONAYLA/REDDET + BİLDİRİM 🔔)
    public void updateEventStatus(Long eventId, EventStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));

        event.setStatus(status);
        eventRepository.save(event);

        // 🔥 BİLDİRİM GÖNDERME KISMI
        String message = status == EventStatus.APPROVED
                ? "Müjde! '" + event.getTitle() + "' başlıklı etkinliğiniz onaylandı ve yayına alındı. 🎉"
                : "Üzgünüz, '" + event.getTitle() + "' başlıklı etkinliğiniz reddedildi. 😔";

        String type = status == EventStatus.APPROVED ? "SUCCESS" : "ERROR";

        // Etkinliği oluşturan kişiye (Requester) gönder
        notificationService.sendNotification(event.getRequester().getId(), message, type);
    }

    // 5. SADECE BEKLEYENLERİ GETİR
    public List<Event> getPendingEvents() {
        return eventRepository.findAll().stream()
                .filter(event -> event.getStatus() == EventStatus.PENDING)
                .collect(Collectors.toList());
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }
}