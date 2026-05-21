package com.mapleland.api.character.dto;

import com.mapleland.core.character.domain.Character;
import lombok.Getter;

@Getter
public class CharacterSelectResponse {
    private final Long characterId;
    private final String nickname;
    private final int level;
    private final String job;
    private final String description;

    public CharacterSelectResponse(Character character) {
        this.characterId = character.getId();
        this.nickname = character.getNickname();
        this.level = character.getLevel();
        this.job = character.getJob();
        this.description = character.getDescription();
    }
}