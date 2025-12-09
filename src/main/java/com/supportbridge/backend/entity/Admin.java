package com.supportbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "admins") // Veritabanında 'admins' tablosu oluşacak
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "user_id") // User tablosuna bağlanacak
public class Admin extends User {

    // Object Model'de (Şekil 2) belirtilen Admin'e özel alan
    @Column(name = "employee_no")
    private String employeeNo;

}