import React, { useState, useEffect } from 'react';

// API 요청을 처리할 기본 베이스 URL 설정
const API_BASE_URL = '/api/v1/characters';

export default function Dashboard() {
    const [characters, setCharacters] = useState([]);
    const [selectedCharacterId, setSelectedCharacterId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 모달 제어 상태
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState(null);

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        nickname: '',
        level: '',
        job: '전사',
        description: ''
    });

    // 공통 헤더 (인터셉터가 파싱할 JWT 토큰 배치)
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });

    // 1. 캐릭터 목록 조회 (GET)
    const fetchCharacters = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setCharacters(data);
            } else if (response.status === 401) {
                handleLogout();
            }
        } catch (error) {
            console.error("캐릭터 목록을 불러오는데 실패했습니다.", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    // 2. 캐릭터 최종 선택 활성화 (POST)
    const handleSelectCharacter = async (characterId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${characterId}/select`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                setSelectedCharacterId(characterId);
                // 성공 시 프론트 전역 스토어(Zustand 등)에 선택된 캐릭터 세팅 후 매칭 화면으로 전환 가능
            }
        } catch (error) {
            console.error("캐릭터 선택에 실패했습니다.", error);
        }
    };

    // 3. 캐릭터 생성 (POST)
    const handleCreateCharacter = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    nickname: formData.nickname,
                    level: parseInt(formData.level),
                    job: formData.job,
                    description: formData.description
                })
            });

            if (response.ok) {
                await fetchCharacters(); // 목록 갱신
                setIsCreateModalOpen(false);
                setFormData({ nickname: '', level: '', job: '전사', description: '' });
            } else {
                const errorMsg = await response.text();
                alert(errorMsg || "캐릭터 생성 실패. 슬롯 초과 혹은 중복된 닉네임입니다.");
            }
        } catch (error) {
            console.error("캐릭터 생성 중 오류가 발생했습니다.", error);
        }
    };

    // 4. 캐릭터 수정 (PATCH)
    const handleEditCharacter = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/${editingCharacter.characterId}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    level: parseInt(formData.level),
                    job: formData.job,
                    description: formData.description
                })
            });

            if (response.ok) {
                await fetchCharacters();
                setIsEditModalOpen(false);
                setEditingCharacter(null);
                setFormData({ nickname: '', level: '', job: '전사', description: '' });
            }
        } catch (error) {
            console.error("캐릭터 수정 중 오류가 발생했습니다.", error);
        }
    };

    // 5. 캐릭터 삭제 (DELETE)

    const handleDeleteCharacter = async (characterId, nickname, level, job) => {
        // 닉네임이 같을 수 있으므로 레벨과 직업을 같이 보여줌
        if (!window.confirm(`[Lv.${level} ${job}] ${nickname} 캐릭터를 완전히 삭제하시겠습니까?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${characterId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                if (selectedCharacterId === characterId) setSelectedCharacterId(null);
                await fetchCharacters();
            }
        } catch (error) {
            console.error("캐릭터 삭제 중 오류가 발생했습니다.", error);
        }
    };

    const openEditModal = (e, char) => {
        e.stopPropagation(); // 카드 선택 이벤트 전파 방지
        setEditingCharacter(char);
        setFormData({
            nickname: char.nickname, // 닉네임은 수정 불가 (읽기 전용 표시)
            level: char.level,
            job: char.job,
            description: char.description || ''
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-900 font-mono text-white p-6 relative">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* 상단 네비게이션 헤더 */}
                <div className="flex justify-between items-center bg-slate-800 p-4 border-2 border-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                    <h1 className="text-xl font-bold text-orange-400 select-none">🍁 mland-queue 대시보드</h1>
                    <button
                        onClick={handleLogout}
                        className="text-xs bg-slate-700 hover:bg-rose-600 px-3 py-1.5 border border-slate-600 hover:border-rose-500 rounded-none transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
                    >
                        로그아웃
                    </button>
                </div>

                {/* 메인 콘텐츠 영역 */}
                <div className="bg-slate-800 p-6 border-2 border-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
                        <h2 className="text-lg font-semibold text-slate-200">내 캐릭터 관리 ({characters.length}/5)</h2>
                        {!isLoading && characters.length < 5 && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="text-xs bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-3 py-1.5 border border-orange-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-colors"
                            >
                                [+ 새 캐릭터 생성]
                            </button>
                        )}
                    </div>

                    {/* 로딩 인디케이터 */}
                    {isLoading ? (
                        <div className="text-center py-12 text-slate-400 text-sm animate-pulse">
                            메이플랜드 캐릭터 정보 동기화 중...
                        </div>
                    ) : characters.length === 0 ? (
                        /* 캐릭터가 없는 경우 예외 처리 */
                        <div className="bg-slate-950 p-12 text-center border-2 border-dashed border-slate-700 text-slate-400 text-sm">
                            등록된 캐릭터가 없습니다. <br />
                            <span
                                onClick={() => setIsCreateModalOpen(true)}
                                className="text-orange-400 font-bold mt-3 inline-block cursor-pointer hover:underline text-base"
                            >
                                [+ 새 캐릭터 등록하기]
                            </span>
                        </div>
                    ) : (
                        /* 캐릭터 슬롯 리스트 (그리드) */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {characters.map((char) => {
                                const isSelected = selectedCharacterId === char.characterId;
                                return (
                                    <div
                                        key={char.characterId}
                                        onClick={() => handleSelectCharacter(char.characterId)}
                                        className={`p-4 border-2 cursor-pointer transition-all relative select-none group
                                            ${isSelected
                                            ? 'bg-slate-900 border-orange-500 shadow-[4px_4px_0px_0px_rgba(249,115,22,0.3)]'
                                            : 'bg-slate-950 border-slate-700 hover:border-slate-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]'
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute top-2 right-2 text-[10px] bg-orange-500 text-slate-950 px-1.5 py-0.5 font-bold">
                                                선택됨
                                            </span>
                                        )}

                                        {/* 수정 및 삭제 버튼 관리 액션바 */}
                                        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => openEditModal(e, char)}
                                                className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 py-0.5 text-slate-300"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteCharacter(char.characterId, char.nickname, char.level, char.job); }}
                                                className="text-[10px] bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-600 hover:border-rose-900 px-2 py-0.5"
                                            >
                                                삭제
                                            </button>
                                        </div>

                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-base font-bold text-slate-100">{char.nickname}</span>
                                            <span className="text-xs text-orange-400 font-semibold">Lv.{char.level}</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mb-2 font-bold">[{char.job}]</div>
                                        <p className="text-xs text-slate-300 border-t border-slate-800 pt-2 pr-16 line-clamp-1">
                                            {char.description || "등록된 소개글이 없습니다."}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 팝업 모달 자산: 생성 및 수정을 단일 양식으로 재사용 제어 */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 border-2 border-slate-600 p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)]">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                            <h3 className="text-base font-bold text-orange-400">
                                {isCreateModalOpen ? '🍁 새 캐릭터 생성' : '📝 캐릭터 정보 수정'}
                            </h3>
                            <button
                                onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setEditingCharacter(null); }}
                                className="text-slate-400 hover:text-white font-bold"
                            >
                                [X]
                            </button>
                        </div>

                        {isCreateModalOpen && (
                            <div className="bg-slate-950 p-3 border border-rose-900/50 mb-4 text-[11px] text-rose-300 leading-relaxed">
                                ⚠️ 반드시 실제 메이플랜드 인게임 닉네임과 동일하게 생성해 주세요.
                                닉네임이 불일치할 경우 매칭 완료 후 파티 초대 명령어 복사 기능이 오작동하며,
                                허위 입력 적발 시 패널티가 부여됩니다.
                            </div>
                        )}

                        <form onSubmit={isCreateModalOpen ? handleCreateCharacter : handleEditCharacter} className="space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="block text-slate-300 font-bold">인게임 닉네임</label>
                                <input
                                    type="text"
                                    name="nickname"
                                    required
                                    disabled={isEditModalOpen} // 수정 시에는 인게임 고유 식별자 명목으로 닉네임 변경 불가 처리
                                    maxLength={12}
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    placeholder="정확하게 입력해 주세요 (최대 12자)"
                                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white focus:outline-none focus:border-orange-500 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-slate-300 font-bold">레벨</label>
                                    <input
                                        type="number"
                                        name="level"
                                        required
                                        min={1}
                                        max={200}
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        placeholder="1 ~ 200"
                                        className="w-full bg-slate-950 border border-slate-700 p-2 text-white focus:outline-none focus:border-orange-500 rounded-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-slate-300 font-bold">직업</label>
                                    <select
                                        name="job"
                                        value={formData.job}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-700 p-2 text-white focus:outline-none focus:border-orange-500 rounded-none"
                                    >
                                        <option value="전사">전사</option>
                                        <option value="마법사">마법사</option>
                                        <option value="궁수">궁수</option>
                                        <option value="도적">도적</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-slate-300 font-bold">한줄 어필 (최대 30자)</label>
                                <input
                                    type="text"
                                    name="description"
                                    maxLength={30}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="예: 스공 1200 노람지 가요"
                                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white focus:outline-none focus:border-orange-500 rounded-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setEditingCharacter(null); }}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 font-bold py-2 border border-slate-600 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-2 border border-orange-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                                >
                                    {isCreateModalOpen ? '등록 완료' : '수정 완료'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}