package com.supportbridge.backend.repository;
import com.supportbridge.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AdminRepository extends JpaRepository<Admin, Long> {}