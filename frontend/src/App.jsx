import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 루트 경로 진입 시 로그인 화면으로 유도 */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

// ⚠️ 이 한 줄이 누락되었거나 대소문자가 틀리면 해당 에러가 발생합니다!
export default App;