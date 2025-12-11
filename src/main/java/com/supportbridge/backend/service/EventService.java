package com.supportbridge.backend.service;

import com.supportbridge.backend.dto.CreateEventRequest;
import com.supportbridge.backend.entity.*;
import com.supportbridge.backend.repository.EventRepository;
import com.supportbridge.backend.repository.RequesterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RequesterRepository requesterRepository;

    public void createEvent(CreateEventRequest request) {
        // 1. Etkinliği oluşturmak isteyen Requester'ı bul
        Requester requester = requesterRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new RuntimeException("Talep eden kullanıcı bulunamadı!"));

        // 2. Yeni etkinlik nesnesini hazırla
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setSubType(request.getSubType());
        event.setDateTime(request.getDateTime());
        event.setCity(request.getCity());
        event.setAddress(request.getAddress());
        event.setQuota(request.getQuota());

        // İlişkiyi kur: Bu etkinliği 'bu requester' oluşturdu
        event.setRequester(requester);

        // Varsayılan durum: PENDING (Admin onayı bekliyor) - Entity'de otomatik atanır ama garanti olsun
        event.setStatus(EventStatus.PENDING);

        // 3. Kaydet
        eventRepository.save(event);
    }
    //-----------------------------------------------------------

    // ETKİNLİK DURUMUNU GÜNCELLEME (Admin İçin)
    public void updateEventStatus(Long eventId, EventStatus newStatus) {
        // 1. Etkinliği bul
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı!"));

        // 2. Durumu değiştir (APPROVED veya REJECTED)
        event.setStatus(newStatus);

        // 3. Kaydet
        eventRepository.save(event);
    }

    // ONAYLI ETKİNLİKLERİ GETİR (Gönüllüler İçin)
    public java.util.List<Event> getAllApprovedEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED);
    }

    // ONAY BEKLEYEN ETKİNLİKLERİ GETİR (Admin İçin)
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING);
    }
}