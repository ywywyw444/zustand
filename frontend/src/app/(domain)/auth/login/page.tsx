'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();

  // Form state management
  const [formData, setFormData] = useState({
    auth_id: '',
    auth_pw: ''
  });

  // Form input handler
  const handleInputChange = async (userData: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = userData.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Railway 프로덕션 환경 로그인 로직
    try {
      // API URL 설정 - Railway 프로덕션 환경
      const apiUrl = 'https://gateway-production-4c8b.up.railway.app';
      
      console.log('🚀 Railway 프로덕션 환경으로 로그인 요청 전송');
      console.log('📝 로그인 데이터:', formData);
      
      const response = await axios.post(`${apiUrl}/api/v1/auth-service/login`, formData);
      
      console.log('✅ Railway 응답:', response.data);
      
      // 성공 메시지 표시
      if (response.data.success) {
        // 사용자 정보를 localStorage에 저장
        const userData = {
          name: response.data.name,
          email: response.data.email,
          company_id: response.data.company_id,
          auth_id: formData.auth_id
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        alert(`✅ 로그인 성공!\n\n이름: ${response.data.name}\n이메일: ${response.data.email}\n회사 ID: ${response.data.company_id}`);
        
        // 로그인 성공 후 대시보드로 이동
        await router.push('/dashboard');
      } else {
        alert(`❌ 로그인 실패: ${response.data.message}`);
      }
      
    } catch (error: unknown) {
      console.error('❌ Railway 로그인 실패:', error);
      
      // 에러 응답 처리 - 타입 가드 사용
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; detail?: string } } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          alert(`❌ 로그인 실패: ${errorData.message || errorData.detail || '알 수 없는 오류'}`);
        } else {
          alert('❌ 로그인에 실패했습니다. Railway 서버 연결을 확인해주세요.');
        }
      } else {
        alert('❌ 로그인에 실패했습니다. Railway 서버 연결을 확인해주세요.');
      }
    }
  };

  // Navigate to signup page
  const handleSignupNavigation = async () => {
    await router.push('/auth/signup');
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const redirectUri = 'http://localhost:3000/dashboard';
      const googleAuthUrl = 'http://localhost:8080/api/v1/auth/google/login';
      const fullUrl = `${googleAuthUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      console.log('🚀 Google 로그인 요청:', fullUrl);
      window.location.href = fullUrl;
    } catch (error) {
      console.error('❌ Google 로그인 오류:', error);
      alert('❌ Google 로그인 처리 중 오류가 발생했습니다.');
    }
  };

  // GitHub login handler
  const handleGitHubLogin = async () => {
    try {
      console.log('🚀 GitHub 로그인 요청');
      // TODO: Implement GitHub login
      alert('🚧 GitHub 로그인 기능은 준비 중입니다.');
    } catch (error) {
      console.error('❌ GitHub 로그인 오류:', error);
      alert('❌ GitHub 로그인 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-12">
          {/* Login Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
              Login
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Auth ID Input */}
            <div className="relative">
              <input
                type="text"
                name="auth_id"
                value={formData.auth_id}
                onChange={handleInputChange}
                placeholder="인증 ID"
                className="w-full px-0 py-4 text-lg text-gray-800 placeholder-gray-400 bg-transparent border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Auth Password Input */}
            <div className="relative">
              <input
                type="password"
                name="auth_pw"
                value={formData.auth_pw}
                onChange={handleInputChange}
                placeholder="인증 비밀번호"
                className="w-full px-0 py-4 text-lg text-gray-800 placeholder-gray-400 bg-transparent border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Find ID/Password Links */}
            <div className="text-center py-6">
              <div className="text-sm text-gray-500 space-x-1">
                <a href="/find-id" className="hover:text-blue-600 transition-colors duration-200">
                  Find ID
                </a>
                <span className="mx-3 text-gray-300">|</span>
                <a href="/find-password" className="hover:text-blue-600 transition-colors duration-200">
                  Find Password
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition-all duration-200 font-medium text-lg shadow-sm"
            >
              Login
            </button>

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={handleSignupNavigation}
              className="w-full bg-white border-2 border-gray-300 text-gray-800 py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-lg shadow-sm"
            >
              Sign Up
            </button>

            {/* Social Login Section */}
            <div className="mt-12">
              <div className="text-center mb-8">
                <span className="text-gray-600 text-base font-medium">Sign in with social accounts</span>
              </div>
              
              {/* Social Login Buttons */}
              <div className="flex justify-center space-x-8">
                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-16 h-16 bg-white border-2 border-gray-200 rounded-3xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>

                {/* GitHub Login */}
                <button
                  onClick={handleGitHubLogin}
                  className="w-16 h-16 bg-white border-2 border-gray-200 rounded-3xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#333">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
