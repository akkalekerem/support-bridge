package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "volunteers")
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "user_id")
public class Volunteer extends User {

    // Gönüllünün tecrübe notu
    @Column(name = "experience_note")
    private String experienceNote;

}