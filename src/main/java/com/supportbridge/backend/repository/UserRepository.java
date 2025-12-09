package com.supportbridge.backend.repository;

import com.supportbridge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Email ile kullanıcı bulma (Giriş yaparken lazım olacak)
    Optional<User> findByEmail(String email);

    // Bu email daha önce alınmış mı? (Kayıt olurken lazım olacak)
    boolean existsByEmail(String email);
}