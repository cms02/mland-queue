package com.mapleland.api.auth.config;

import com.mapleland.api.auth.presentation.AuthenticationInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuthenticationInterceptor authenticationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticationInterceptor)
                .addPathPatterns("/api/v1/characters/**") // 캐릭터 관련 모든 API에 인터셉터 적용
                .excludePathPatterns("/api/v1/auth/**");    // 로그인, 토큰 발급 등은 예외 처리
    }
}