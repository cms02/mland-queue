package com.mapleland.core.character.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "characters")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 시스템 내부 고유 고성능 식별자 배치
    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 12)
    private String nickname; // 인게임 실제 메이플랜드 닉네임과 매핑

    @Column(nullable = false)
    private int level;

    @Column(nullable = false, length = 30)
    private String job;

    @Column(length = 90) // 최대 한글 30자 제약 준수용
    private String description;

    @Column(length = 255)
    private String codyData; // 추후 코디 의상 상점/스타일 연동 레이아웃용 플러그

    private LocalDateTime createdAt;

    @Builder
    public Character(Long userId, String nickname, int level, String job, String description, String codyData) {
        this.userId = userId;
        this.nickname = nickname;
        this.level = level;
        this.job = job;
        this.description = description;
        this.codyData = codyData;
        this.createdAt = LocalDateTime.now();
    }

    // Character 엔티티 내부에 아래 메서드를 추가해 주세요.

    /**
     * 캐릭터 정보 수정 (더티 체킹 반영)
     * 인게임 초대 무결성을 위해 닉네임은 수정 항목에서 제외합니다.
     */
    public void updateInfo(int level, String job, String description) {
        if (level < 1 || level > 200) {
            throw new IllegalArgumentException("올바르지 않은 레벨 범위입니다. (1~200)");
        }
        this.level = level;
        this.job = job;
        this.description = description;
    }
}