package com.mapleland.api.auth.security.handler;

import com.mapleland.api.auth.security.jwt.JwtTokenProvider;
import com.mapleland.core.user.domain.User;
import com.mapleland.core.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository; // module-core에서 전파된 레포지토리 주입

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String discordId = oAuth2User.getAttribute("id");
        String username = oAuth2User.getAttribute("username");
        String email = oAuth2User.getAttribute("email");

        // 1. 유저 정보 저장 또는 갱신 (Upsert)
        userRepository.findByDiscordId(discordId)
                .ifPresentOrElse(
                        user -> user.updateProfile(username, email),
                        () -> userRepository.save(User.builder()
                                .discordId(discordId)
                                .username(username)
                                .email(email)
                                .build())
                );

        // 2. 토큰 생성 및 인메모리(Redis) RT 적재
        String accessToken = jwtTokenProvider.createAccessToken(discordId);
        String refreshToken = jwtTokenProvider.createRefreshToken(discordId);

        redisTemplate.opsForValue().set(
                "RT:" + refreshToken,
                discordId,
                jwtTokenProvider.getRefreshTokenValidityInSeconds(),
                TimeUnit.SECONDS
        );

        // 3. 쿠키 및 리다이렉트 처리
        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge((int) jwtTokenProvider.getRefreshTokenValidityInSeconds());
        response.addCookie(refreshTokenCookie);

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/login-success")
                .queryParam("token", accessToken)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}