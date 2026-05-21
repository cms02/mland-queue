import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // 주소창의 쿼리 스트링에서 'token' 파라미터 추출
        const token = searchParams.get('token');

        if (token) {
            // 로컬 스토리지에 Access Token 저장 (이후 API 요청 시 Authorization 헤더에 Bearer로 부착)
            localStorage.setItem('accessToken', token);

            // 기획서 3번 항목의 메인 관리 화면(대시보드) 경로로 이동
            navigate('/dashboard');
        } else {
            // 토큰 유실 시 로그인 페이지로 복귀
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 font-mono text-white">
            <div className="text-center space-y-4">
                {/* 주황 버섯 감성의 스피너 */}
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-orange-400 font-bold tracking-widest text-sm animate-pulse">
                    인증 데이터를 동기화 중입니다...
                </p>
            </div>
        </div>
    );
}