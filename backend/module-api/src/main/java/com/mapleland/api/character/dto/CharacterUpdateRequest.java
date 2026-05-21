package com.mapleland.api.character.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CharacterUpdateRequest {

    @Min(value = 1, message = "레벨은 1 이상이어야 합니다.")
    @Max(value = 200, message = "레벨은 200 이하이어야 합니다.")
    private int level;

    @NotBlank(message = "직업은 필수입니다.")
    private String job;

    @Size(max = 30, message = "한줄 어필은 최대 30자까지 입력 가능합니다.")
    private String description;
}