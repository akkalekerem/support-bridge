package com.supportbridge.backend.repository;
import com.supportbridge.backend.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {}