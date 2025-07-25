"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function RegisterUserPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false); // State for custom dropdown visibility

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'inspektur', label: 'Inspektur' },
  ];

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Effect to handle clicks outside the custom dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !password || !role) {
      setError('Mohon lengkapi semua bidang yang wajib diisi.');
      return;
    }

    const userData = { username, password, role };
    console.log('Data User yang didaftarkan:', userData);
    setSuccessMessage('User berhasil didaftarkan (simulasi)!');
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setIsRoleDropdownOpen(false); // Close dropdown after selection
  };

  return (
    // Main container with a gradient background, padding, and Inter font
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 font-inter">
      {/* Header section with enhanced styling */}
      <header className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-800 text-center sm:text-left">Daftar User Baru</h1>
        {/* Link to dashboard with improved button styling */}
        <Link
          href="/dashboard"
          className="inline-flex items-center px-5 py-2 border border-blue-400 text-base font-medium rounded-lg shadow-sm text-blue-600 bg-white hover:bg-blue-50 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
          Kembali ke Dashboard
        </Link>
      </header>

      {/* Form Container with modern styling */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 text-center">Form Pendaftaran User</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message display with enhanced styling */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}
          {/* Success message display with enhanced styling */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {successMessage}
            </div>
          )}

          {/* Username input field */}
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
            />
          </div>

          {/* Password input field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Custom Role dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label htmlFor="role-select" className="block text-gray-700 text-sm font-medium mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              id="role-select"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-between items-center"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isRoleDropdownOpen}
            >
              {roleOptions.find(option => option.value === role)?.label || 'Pilih Role'}
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {isRoleDropdownOpen && (
              <ul
                className="absolute z-10 mt-1 w-60 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                tabIndex="-1"
                role="listbox"
                aria-labelledby="role-select"
              >
                {roleOptions.map((option) => (
                  <li
                    key={option.value}
                    className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50 hover:text-blue-900"
                    id={`role-option-${option.value}`}
                    role="option"
                    aria-selected={role === option.value}
                    onClick={() => handleRoleSelect(option.value)}
                  >
                    <span className={`block truncate ${role === option.value ? 'font-semibold' : 'font-normal'}`}>
                      {option.label}
                    </span>
                    {role === option.value ? (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit button with attractive styling and hover effects */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Daftarkan User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
