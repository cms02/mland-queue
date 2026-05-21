import React from 'react';

export default function Login() {
    const handleDiscordLogin = () => {
        // 백엔드 Spring Security OAuth2 엔드포인트로 이동
        window.location.href = 'http://localhost:8080/oauth2/authorization/discord';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 font-mono text-white select-none">
            {/* 메이플 인게임 감성의 더블 보더 박스 */}
            <div className="w-full max-w-md p-8 bg-slate-800 border-4 border-double border-orange-500 rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] text-center">

                <h1 className="text-3xl font-extrabold tracking-wider text-orange-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] uppercase mb-2">
                    🍁 mland-queue
                </h1>
                <p className="text-xs text-slate-400 mb-8">메이플랜드 자동 파티 매칭 시스템</p>

                <div className="bg-slate-950 p-4 border border-slate-700 rounded-sm text-left mb-6 text-sm text-slate-300 space-y-1">
                    <p className="text-orange-300 font-bold">⚠️ 본인 인증 안내</p>
                    <p>• mland-queue는 디스코드 인증을 필수 계정으로 사용합니다.</p>
                    <p>• 인증 후 캐릭터 등록 및 대시보드 진입이 가능합니다.</p>
                </div>

                {/* 디스코드 시그니처 컬러 매칭 버튼 */}
                <button
                    onClick={handleDiscordLogin}
                    className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-4 border-b-4 border-blue-900 rounded-sm active:border-b-0 active:mt-1 transition-all text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                >
                    Discord 계정으로 로그인
                </button>
            </div>
        </div>
    );
}