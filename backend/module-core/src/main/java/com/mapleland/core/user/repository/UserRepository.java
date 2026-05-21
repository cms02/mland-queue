package com.mapleland.core.user.repository;

import com.mapleland.core.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 디스코드 식별자로 기존 가입 유저 조회
    Optional<User> findByDiscordId(String discordId);
}