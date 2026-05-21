package com.mapleland.api.character.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CharacterCreateRequest {

    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(max = 12, message = "메이플랜드 닉네임은 최대 12자입니다.")
    private String nickname;

    private int level;

    @NotBlank(message = "직업은 필수입니다.")
    private String job;

    @Size(max = 30, message = "자기소개는 최대 30자까지 입력 가능합니다.")
    private String description;
}