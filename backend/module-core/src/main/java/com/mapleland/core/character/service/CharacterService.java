package com.mapleland.core.character.service;

import com.mapleland.core.character.domain.Character;
import com.mapleland.core.character.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CharacterService {

    private final CharacterRepository characterRepository;

    @Value("${app.policy.max-character-count:5}")
    private int maxCharacterCount;

    public List<Character> getUserCharacters(Long userId) {
        return characterRepository.findByUserId(userId);
    }

    @Transactional
    public void selectUserCharacter(Long userId, Long characterId) {
        Character character = characterRepository.findById(characterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 캐릭터입니다."));

        if (!character.getUserId().equals(userId)) {
            throw new IllegalStateException("해당 캐릭터에 대한 접근 권한이 없습니다.");
        }
        // 성공 시 이후 Redis 세션 바인딩 단계로 진입
    }

    /**
     * 캐릭터 생성 로직 (최대 슬롯 제한 제어)
     */
    @Transactional
    public Long createCharacter(Long userId, String nickname, int level, String job, String description) {
        // 1. 현재 생성된 캐릭터 개수 조회
        long currentCount = characterRepository.countByUserId(userId);

        // 2. 확장성 정책 검증 (5개 제한, 추후 yml 수정으로 확장 가능)
        if (currentCount >= maxCharacterCount) {
            throw new IllegalStateException("생성 가능한 캐릭터 슬롯(" + maxCharacterCount + "개)을 초과했습니다.");
        }

        Character character = Character.builder()
                .userId(userId)
                .nickname(nickname)
                .level(level)
                .job(job)
                .description(description)
                .build();

        return characterRepository.save(character).getId();
    }

    @Transactional
    public void deleteCharacter(Long userId, Long characterId) {
        Character character = characterRepository.findById(characterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 캐릭터입니다."));

        // 🔒 소유권 검증: 본인의 캐릭터만 삭제 가능
        if (!character.getUserId().equals(userId)) {
            throw new IllegalStateException("해당 캐릭터를 삭제할 권한이 없습니다.");
        }

        characterRepository.delete(character);
    }

    @Transactional
    public void updateCharacter(Long userId, Long characterId, int level, String job, String description) {
        Character character = characterRepository.findById(characterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 캐릭터입니다."));

        // 🔒 소유권 검증: 본인의 캐릭터만 수정 가능
        if (!character.getUserId().equals(userId)) {
            throw new IllegalStateException("해당 캐릭터를 수정할 권한이 없습니다.");
        }

        // 도메인 엔티티 내부 변경 메서드 호출 (더티 체킹 반영)
        character.updateInfo(level, job, description);
    }

    // ... 기존 getUserCharacters, selectUserCharacter 메서드 생략
}