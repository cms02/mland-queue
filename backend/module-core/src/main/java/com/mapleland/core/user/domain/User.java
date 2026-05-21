package com.mapleland.core.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 디스코드 고유 유저 ID (예: "234987239482394")
    @Column(nullable = false, unique = true, length = 50)
    private String discordId;

    // 디스코드 유저명
    @Column(nullable = false, length = 100)
    private String username;

    // 디스코드 이메일 (선택 동의 및 누락 가능성 대비 nullable)
    @Column(length = 150)
    private String email;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public User(String discordId, String username, String email) {
        this.discordId = discordId;
        this.username = username;
        this.email = email;
    }

    // 디스코드 프로필 정보 변경 시 업데이트 메소드
    public void updateProfile(String username, String email) {
        this.username = username;
        this.email = email;
    }
}