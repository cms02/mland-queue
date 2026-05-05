import React, { useState } from 'react'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleLogin = (provider) => {
        console.log(`${provider} 로그인 시도`)
        setIsLoggedIn(true)
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
    }

    // 로그인 화면 컴포넌트
    const LoginPage = () => (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-10 text-center">
                <div className="mb-12">
                    <div className="inline-block bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <span className="text-3xl font-bold text-white">ML</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">M-Land</h1>
                    <p className="text-slate-500 mt-2">함께할 팀원을 찾는 가장 빠른 방법</p>
                </div>
                <div className="space-y-4">
                    <button onClick={() => handleLogin('kakao')} className="w-full flex items-center justify-center gap-3 py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold rounded-xl transition-all">
                        <img src="https://developers.kakao.com/assets/img/reference/iphone_symbol.png" alt="Kakao" className="w-6 h-6" />
                        카카오로 시작하기
                    </button>
                    <button onClick={() => handleLogin('discord')} className="w-full flex items-center justify-center gap-3 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all">
                        <span className="text-xl">👾</span> 디스코드로 시작하기
                    </button>
                </div>
            </div>
        </div>
    )

    // 대기 화면 컴포넌트
    const WaitingPage = () => (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-center">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-white mb-2">M-Land</h1>
                    <p className="text-slate-400 text-sm">매칭 대기 중...</p>
                </div>
                <div className="relative flex justify-center items-center mb-10">
                    <div className="absolute w-24 h-24 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute w-24 h-24 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="bg-blue-500/10 p-4 rounded-full text-2xl">⚡</div>
                </div>
                <button onClick={handleLogout} className="w-full py-4 bg-slate-800 hover:bg-red-500/20 hover:text-red-500 text-slate-300 font-semibold rounded-2xl transition-all border border-slate-700 hover:border-red-500/50">
                    로그아웃 (취소)
                </button>
            </div>
        </div>
    )

    return (
        <>{isLoggedIn ? <WaitingPage /> : <LoginPage />}</>
    )
}