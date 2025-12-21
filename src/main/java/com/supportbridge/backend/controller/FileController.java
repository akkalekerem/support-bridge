package com.supportbridge.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    // Dosyaların kaydedileceği yer (Proje kök dizininde 'uploads' klasörü)
    private static final String UPLOAD_DIR = "uploads";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Klasör yoksa oluştur
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Benzersiz dosya adı oluştur (çakışmayı önlemek için UUID)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);

            // Dosyayı kaydet
            Files.write(filePath, file.getBytes());

            // Kaydedilen dosyanın yolunu döndür (Frontend bunu form'a ekleyecek)
            // Gerçek hayatta burası "/uploads/filename" gibi bir URL olurdu.
            // Şimdilik sadece dosya adını veya basit yolu dönüyoruz.
            return ResponseEntity.ok("/" + UPLOAD_DIR + "/" + fileName);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Dosya yüklenirken hata oluştu!");
        }
    }

    // Yüklenen dosyayı görüntülemek için (Opsiyonel - PDF'i açmak istersek)
    @GetMapping("/{fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) throws IOException {
        File file = new File(UPLOAD_DIR + "/" + fileName);
        if (file.exists()) {
            byte[] fileContent = Files.readAllBytes(file.toPath());
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(fileContent);
        }
        return ResponseEntity.notFound().build();
    }
}
