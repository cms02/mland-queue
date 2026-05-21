import React from 'react';

export default function Dashboard() {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-900 font-mono text-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* 상단 네비게이션 헤더 */}
                <div className="flex justify-between items-center bg-slate-800 p-4 border border-slate-700 rounded-sm">
                    <h1 className="text-xl font-bold text-orange-400">🍁 mland-queue 대시보드</h1>
                    <button
                        onClick={handleLogout}
                        className="text-xs bg-slate-700 hover:bg-rose-600 px-3 py-1.5 rounded-sm transition-colors"
                    >
                        로그아웃
                    </button>
                </div>

                {/* 메인 컨텐츠 영역 */}
                <div className="bg-slate-800 p-6 border border-slate-700 rounded-sm">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">내 캐릭터 관리</h2>
                    <div className="bg-slate-950 p-8 text-center border border-dashed border-slate-700 text-slate-400 rounded-sm text-sm">
                        등록된 캐릭터가 없습니다. <br />
                        <span className="text-orange-400 font-semibold mt-2 inline-block cursor-pointer hover:underline">
              [+ 새 캐릭터 등록하기]
            </span>
                    </div>
                </div>

            </div>
        </div>
    );
}