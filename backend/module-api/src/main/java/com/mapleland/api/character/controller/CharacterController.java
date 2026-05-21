package com.mapleland.api.character.controller;

import com.mapleland.api.character.dto.CharacterCreateRequest;
import com.mapleland.api.character.dto.CharacterSelectResponse;
import com.mapleland.api.character.dto.CharacterUpdateRequest;
import com.mapleland.core.character.service.CharacterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    /**
     * 로그인 완료 후 캐릭터 선택창 진입 시 유저의 캐릭터 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<CharacterSelectResponse>> getMyCharacters(@RequestAttribute("userId") Long userId) {
        List<CharacterSelectResponse> responses = characterService.getUserCharacters(userId).stream()
                .map(CharacterSelectResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    /**
     * 매칭 대기열 진입을 위해 사용할 캐릭터 최종 선택
     */
    @PostMapping("/{characterId}/select")
    public ResponseEntity<Void> selectCharacter(
            @RequestAttribute("userId") Long userId,
            @PathVariable("characterId") Long characterId) {

        // 깔끔하게 시스템 고유 식별자(Long) 기반으로 소유권 검증 및 선택 세션 활성화
        characterService.selectUserCharacter(userId, characterId);

        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Long> createCharacter(
            @RequestAttribute("userId") Long userId,
            @Valid @RequestBody CharacterCreateRequest request) {

        Long characterId = characterService.createCharacter(
                userId,
                request.getNickname(),
                request.getLevel(),
                request.getJob(),
                request.getDescription()
        );

        return ResponseEntity.ok(characterId);
    }

    @DeleteMapping("/{characterId}")
    public ResponseEntity<Void> deleteCharacter(
            @RequestAttribute("userId") Long userId,
            @PathVariable("characterId") Long characterId) {

        characterService.deleteCharacter(userId, characterId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{characterId}")
    public ResponseEntity<Void> updateCharacter(
            @RequestAttribute("userId") Long userId,
            @PathVariable("characterId") Long characterId,
            @Valid @RequestBody CharacterUpdateRequest request) {

        // 서비스 단으로 토스하여 소유권 검증 후 더티 체킹 수정 진행
        characterService.updateCharacter(
                userId,
                characterId,
                request.getLevel(),
                request.getJob(),
                request.getDescription()
        );

        return ResponseEntity.ok().build();
    }
}