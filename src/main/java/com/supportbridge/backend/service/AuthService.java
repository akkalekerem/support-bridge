package com.supportbridge.backend.service;

import com.supportbridge.backend.dto.AuthResponse;
import com.supportbridge.backend.dto.RegisterRequest;
import com.supportbridge.backend.entity.*;
import com.supportbridge.backend.repository.RequesterRepository;
import com.supportbridge.backend.repository.UserRepository;
import com.supportbridge.backend.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Repository'leri otomatik enjekte eder (Autowired yerine geçer)
public class AuthService {

    private final UserRepository userRepository;
    private final VolunteerRepository volunteerRepository;
    private final RequesterRepository requesterRepository;
    private final PasswordEncoder passwordEncoder;

    // KAYIT OLMA METODU
    public void register(RegisterRequest request) {
        // 1. Bu email daha önce alınmış mı?
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Bu email adresi zaten kullanımda!");
        }

        // 2. Kullanıcı Gönüllü mü yoksa Talep Eden mi?
        if (request.getRole() == Role.VOLUNTEER) {
            // --- GÖNÜLLÜ KAYDI ---
            Volunteer volunteer = new Volunteer();
            volunteer.setFirstName(request.getFirstName());
            volunteer.setLastName(request.getLastName());
            volunteer.setEmail(request.getEmail());
            // Şifreyi şifreleyerek kaydet
            volunteer.setPassword(passwordEncoder.encode(request.getPassword()));
            volunteer.setPhoneNumber(request.getPhoneNumber());
            volunteer.setRole(Role.VOLUNTEER);
            // Gönüllüye özel alan
            volunteer.setExperienceNote(request.getExperienceNote());

            volunteerRepository.save(volunteer);

        } else if (request.getRole() == Role.REQUESTER) {
            // --- TALEP EDEN KAYDI ---
            Requester requester = new Requester();
            requester.setFirstName(request.getFirstName());
            requester.setLastName(request.getLastName());
            requester.setEmail(request.getEmail());
            requester.setPassword(passwordEncoder.encode(request.getPassword()));
            requester.setPhoneNumber(request.getPhoneNumber());
            requester.setRole(Role.REQUESTER);
            // Talep edene özel alanlar
            requester.setDocumentPath(request.getDocumentPath());
            requester.setVerificationStatus(VerificationStatus.PENDING); // Başlangıçta onaysız

            requesterRepository.save(requester);

        } else {
            throw new RuntimeException("Geçersiz rol seçimi!");
        }
    }

    // ... register metodu bittikten sonra ...

    // GİRİŞ YAPMA METODU
    public AuthResponse login(com.supportbridge.backend.dto.LoginRequest request) {
        // 1. Kullanıcıyı email ile bul
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı veya şifre hatalı!"));

        // 2. Şifreyi kontrol et (Girilen şifre ile veritabanındaki şifreli hali kıyasla)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Kullanıcı bulunamadı veya şifre hatalı!");
        }

        // 3. Giriş başarılı! Bilgileri dön
        return new AuthResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                "Giriş Başarılı"
        );
    }
}