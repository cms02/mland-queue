package com.mapleland.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.mapleland") // 모든 모듈의 Bean 스캔
@EntityScan(basePackages = "com.mapleland")               // 모든 모듈의 Entity 스캔
@EnableJpaRepositories(basePackages = "com.mapleland")    // 모든 모듈의 Repository 스캔
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}