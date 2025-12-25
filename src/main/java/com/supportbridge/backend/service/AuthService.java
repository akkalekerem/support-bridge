package com.supportbridge.backend.service;

import com.supportbridge.backend.dto.AuthResponse;
import com.supportbridge.backend.dto.RegisterRequest;
import com.supportbridge.backend.dto.LoginRequest;
import com.supportbridge.backend.entity.*;
import com.supportbridge.backend.repository.RequesterRepository;
import com.supportbridge.backend.repository.UserRepository;
import com.supportbridge.backend.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VolunteerRepository volunteerRepository;
    private final RequesterRepository requesterRepository;
    private final PasswordEncoder passwordEncoder;

    // --- KAYIT OLMA METODU (Dosya Destekli ve Telefon Kontrollü) ---
    public void register(RegisterRequest request, MultipartFile file) {

        // 1. E-posta Kontrolü
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Bu email adresi zaten kullanımda!");
        }

        // 🔥 2. EKLENEN KISIM: TELEFON ZORUNLULUĞU KONTROLÜ 🔥
        // Eğer telefon null gelirse veya boş string ("") gelirse hata fırlatıyoruz.
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            throw new RuntimeException("Telefon numarası girmek zorunludur!");
        }

        if (request.getRole() == Role.VOLUNTEER) {
            Volunteer volunteer = new Volunteer();
            volunteer.setFirstName(request.getFirstName());
            volunteer.setLastName(request.getLastName());
            volunteer.setEmail(request.getEmail());
            volunteer.setPassword(passwordEncoder.encode(request.getPassword()));
            volunteer.setPhoneNumber(request.getPhoneNumber()); // Telefonu set ediyoruz
            volunteer.setRole(Role.VOLUNTEER);
            volunteer.setExperienceNote(request.getExperienceNote());
            volunteerRepository.save(volunteer);

        } else if (request.getRole() == Role.REQUESTER) {
            // PDF KONTROLÜ
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("Talep edenlerin durum belgesi (PDF) yüklemesi zorunludur!");
            }

            String filePath;
            try {
                // Klasör oluştur
                String uploadDir = "uploads/documents/";
                File directory = new File(uploadDir);
                if (!directory.exists()) directory.mkdirs();

                // Dosya adını benzersiz yap
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path path = Paths.get(uploadDir + fileName);
                Files.write(path, file.getBytes());
                filePath = path.toString();

            } catch (IOException e) {
                throw new RuntimeException("Dosya yüklenirken hata oluştu: " + e.getMessage());
            }

            Requester requester = new Requester();
            requester.setFirstName(request.getFirstName());
            requester.setLastName(request.getLastName());
            requester.setEmail(request.getEmail());
            requester.setPassword(passwordEncoder.encode(request.getPassword()));
            requester.setPhoneNumber(request.getPhoneNumber()); // Telefonu set ediyoruz
            requester.setRole(Role.REQUESTER);
            requester.setDocumentPath(filePath);
            requester.setVerificationStatus(VerificationStatus.PENDING);
            requesterRepository.save(requester);

        } else {
            throw new RuntimeException("Geçersiz rol seçimi!");
        }
    }

    // --- GİRİŞ YAPMA METODU (Aynen Kalıyor) ---
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı veya şifre hatalı!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Kullanıcı bulunamadı veya şifre hatalı!");
        }

        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setMessage("Giriş Başarılı");

        if (user instanceof Volunteer) {
            response.setExperienceNote(((Volunteer) user).getExperienceNote());
        }
        if (user instanceof Requester) {
            response.setDocumentPath(((Requester) user).getDocumentPath());
        }

        return response;
    }
}