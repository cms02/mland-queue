package com.mapleland.api.auth.presentation;

import com.mapleland.api.auth.security.jwt.JwtTokenProvider;
import com.mapleland.core.user.domain.User;
import com.mapleland.core.user.repository.UserRepository; // 유저 레포지토리 주입
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthenticationInterceptor implements HandlerInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository; // 내부 userId 조회를 위한 의존성 추가

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "인증 토큰이 누락되었습니다.");
            return false;
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않거나 만료된 토큰입니다.");
            return false;
        }

        // 인터셉터 내부 preHandle 로직 점검
        String discordId = jwtTokenProvider.getDiscordId(token);

        // ⚠️ 테스트 환경에서 디스코드 토큰은 유효하나, DB(users 테이블)에 해당 discordId를 가진 유저 레코드가 실제로 존재하는지 확인해 주세요.
        User user = userRepository.findByDiscordId(discordId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // ⚠️ 이 코드가 무사히 실행되어야 컨트롤러가 에러를 안 뿜습니다.
        request.setAttribute("userId", user.getId());
        return true;
    }
}