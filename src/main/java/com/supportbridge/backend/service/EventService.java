package com.supportbridge.backend.service;

import com.supportbridge.backend.entity.Event;
import com.supportbridge.backend.entity.EventStatus;
import com.supportbridge.backend.entity.Requester;
import com.supportbridge.backend.entity.User;
import com.supportbridge.backend.repository.EventRepository;
import com.supportbridge.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // 1. ETKİNLİK OLUŞTUR (GÜNCELLENDİ: ID ve Event alıyor)
    public Event createEvent(Long requesterId, Event event) {
        // Kullanıcıyı bul
        User user = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        // Kullanıcının rolü Requester mı? (Güvenlik kontrolü)
        if (!(user instanceof Requester)) {
            throw new RuntimeException("Sadece Talep Edenler etkinlik oluşturabilir!");
        }

        // İlişkiyi kur
        event.setRequester((Requester) user);

        // Varsayılan ayarlar
        event.setCreatedAt(LocalDateTime.now());
        event.setStatus(EventStatus.PENDING); // Admin onayı bekleyecek

        return eventRepository.save(event);
    }

    // 2. ONAYLI ETKİNLİKLERİ GETİR (Gönüllüler için)
    public List<Event> getAllApprovedEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED);
    }

    // 3. ONAY BEKLEYENLERİ GETİR (Admin için)
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING);
    }

    // 4. TALEP EDENİN KENDİ ETKİNLİKLERİNİ GETİR (YENİ EKLENDİ - Hatanın Çözümü)
    public List<Event> getEventsByRequester(Long requesterId) {
        return eventRepository.findByRequesterId(requesterId);
    }

    // ETKİNLİK DURUMUNU GÜNCELLE (Admin için)
    public void updateEventStatus(Long eventId, EventStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı!"));

        event.setStatus(status);
        eventRepository.save(event);

        // Bildirim Gönder
        String message = "";
        if (status == EventStatus.APPROVED) {
            message = "Etkinliğiniz ('" + event.getTitle() + "') onaylandı! 🎉";
        } else if (status == EventStatus.REJECTED) {
            message = "Etkinliğiniz ('" + event.getTitle() + "') maalesef reddedildi. 😔";
        }

        if (!message.isEmpty()) {
            notificationService.createNotification(event.getRequester().getId(), message);
        }
    }
}