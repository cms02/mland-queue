package com.mapleland.api.controller;

import com.mapleland.api.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request) {
        // 1. 쿠키에서 Refresh Token 추출
        String refreshToken = Arrays.stream(request.getCookies() != null ? request.getCookies() : new Cookie[0])
                .filter(cookie -> "refresh_token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 Refresh Token입니다.");
        }

        // 2. Redis에서 유효한 토큰인지 검증 및 유저 식별자 파악
        String discordId = redisTemplate.opsForValue().get("RT:" + refreshToken);
        if (discordId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("만료되거나 존재하지 않는 Refresh Token입니다.");
        }

        // 3. 새로운 Access Token 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(discordId);

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }
}
