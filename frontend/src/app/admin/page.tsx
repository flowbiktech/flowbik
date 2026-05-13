'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-[#06060e] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px] bg-[#10101e] border border-[#1c1c32] rounded-[20px] p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-[14px] text-[#6e6e96]">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <label className="block text-[13px] font-medium text-[#6e6e96] mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@Flowbik"
              className="w-full px-4 py-3 bg-[#0b0b16] border border-[#1c1c32] rounded-[12px] text-white text-[14px] outline-none focus:border-[#3b82f6] transition-all"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-[13px] font-medium text-[#6e6e96] mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0b0b16] border border-[#1c1c32] rounded-[12px] text-white text-[14px] outline-none focus:border-[#3b82f6] transition-all"
              required
            />
          </div>
          {error && <p className="text-[12px] text-[#ef4444] text-center">{error}</p>}
          <button type="submit" className="mt-2 py-3.5 rounded-[12px] bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-bold text-[14px] hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] transition-all">
            Login Now
          </button>
        </form>
      </div>
    </div>
  );
}
