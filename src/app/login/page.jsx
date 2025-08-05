"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter untuk navigasi

export default function LoginPage() {
  const [email, setEmail] = useState(''); // Menggunakan 'email' sebagai placeholder, tapi backend pakai 'username'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login berhasil:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        
        setSuccessMessage('Login berhasil! Mengarahkan ke dashboard...');
        router.push('/dashboard'); 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login gagal. Periksa kembali kredensial Anda.');
        console.error('Login error:', errorData);
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan atau server tidak dapat dijangkau.');
      console.error('Network or server error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image
            src="/WikaGedung.png"
            alt="Logo Perusahaan/Proyek"
            width={120}
            height={120}
            className="h-auto max-w-full"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login ke APAR Monitoring</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm relative mb-4" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm relative mb-4" role="alert">
              {successMessage}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            {/* PERBAIKAN DI SINI: Semua atribut input dalam satu tag pembuka */}
            <input
              type="text" // Ganti type="email" menjadi type="text"
              id="email" // Biarkan id 'email' atau ganti jadi 'username' jika mau konsisten
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400" // Sesuaikan styling input
              placeholder="Masukkan username Anda"
              value={email} // Tetap pakai state email, tapi isinya username
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md hover:shadow-lg w-full"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}