"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import komponen Image

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* Tambahkan logo di sini, sebelum <h2> */}
        <div className="flex justify-center mb-6"> {/* Kontainer untuk memposisikan logo di tengah */}
          <Image
            src="/WikaGedung.png" // Path ke logo Anda, relatif terhadap folder public
            alt="Logo Perusahaan/Proyek" // Deskripsi alt untuk aksesibilitas
            width={120} // Lebar dasar gambar (dalam piksel)
            height={120} // Tinggi dasar gambar (dalam piksel)
            className="h-auto max-w-full" // Kelas Tailwind untuk responsivitas
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="nama@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#00AEEF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out"
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