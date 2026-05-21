package com.mapleland.core.character.repository;

import com.mapleland.core.character.domain.Character;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CharacterRepository extends JpaRepository<Character, Long> {
    long countByUserId(Long userId);
    List<Character> findByUserId(Long userId);
}