package com.supportbridge.backend.service;

import com.supportbridge.backend.dto.AuthResponse; // Düzeltildi
import com.supportbridge.backend.dto.RegisterRequest; // Düzeltildi
import com.supportbridge.backend.dto.LoginRequest; // Düzeltildi
import com.supportbridge.backend.entity.*;
import com.supportbridge.backend.repository.RequesterRepository;
import com.supportbridge.backend.repository.UserRepository;
import com.supportbridge.backend.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VolunteerRepository volunteerRepository;
    private final RequesterRepository requesterRepository;
    private final PasswordEncoder passwordEncoder;

    // --- KAYIT OLMA METODU ---
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Bu email adresi zaten kullanımda!");
        }

        if (request.getRole() == Role.VOLUNTEER) {
            Volunteer volunteer = new Volunteer();
            volunteer.setFirstName(request.getFirstName());
            volunteer.setLastName(request.getLastName());
            volunteer.setEmail(request.getEmail());
            volunteer.setPassword(passwordEncoder.encode(request.getPassword()));
            volunteer.setPhoneNumber(request.getPhoneNumber());
            volunteer.setRole(Role.VOLUNTEER);
            volunteer.setExperienceNote(request.getExperienceNote());
            volunteerRepository.save(volunteer);

        } else if (request.getRole() == Role.REQUESTER) {
            Requester requester = new Requester();
            requester.setFirstName(request.getFirstName());
            requester.setLastName(request.getLastName());
            requester.setEmail(request.getEmail());
            requester.setPassword(passwordEncoder.encode(request.getPassword()));
            requester.setPhoneNumber(request.getPhoneNumber());
            requester.setRole(Role.REQUESTER);
            requester.setDocumentPath(request.getDocumentPath());
            requester.setVerificationStatus(VerificationStatus.PENDING);
            requesterRepository.save(requester);

        } else {
            throw new RuntimeException("Geçersiz rol seçimi!");
        }
    }

    // --- GİRİŞ YAPMA METODU ---
    public AuthResponse login(LoginRequest request) {
        // 1. Kullanıcıyı bul
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı veya şifre hatalı!"));

        // 2. Şifre kontrolü
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Kullanıcı bulunamadı veya şifre hatalı!");
        }

        // 3. Yanıtı hazırla
        // Artık AuthResponse() boş constructor çalıştığı için hata vermeyecek
        AuthResponse response = new AuthResponse();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());          // Eklendi
        response.setPhoneNumber(user.getPhoneNumber()); // Eklendi
        response.setRole(user.getRole());
        response.setMessage("Giriş Başarılı");

        // Kullanıcı Gönüllü mü?
        if (user instanceof Volunteer) {
            response.setExperienceNote(((Volunteer) user).getExperienceNote());
        }

        // Kullanıcı Talep Eden mi?
        if (user instanceof Requester) {
            response.setDocumentPath(((Requester) user).getDocumentPath());
        }

        return response;
    }
}