package com.supportbridge.backend.repository;
import com.supportbridge.backend.entity.Requester;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RequesterRepository extends JpaRepository<Requester, Long> {}