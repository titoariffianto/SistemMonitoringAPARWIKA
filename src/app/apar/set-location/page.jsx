"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SetLocationPage() {
  const [selectedBuilding, setSelectedBuilding] = useState('Gedung F'); // Default gedung
  const [pinPosition, setPinPosition] = useState(null); // { x: 0.5, y: 0.5 } in percentage
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const imageContainerRef = useRef(null); // Ref untuk div pembungkus gambar
  const aparId = "APAR-XXX"; // Placeholder: Di aplikasi nyata, ID APAR akan diterima dari URL atau state

  // Pilihan Gedung
  const gedungOptions = [
    { value: 'Gedung F', label: 'Gedung F' },
    { value: 'Gedung G', label: 'Gedung G' },
    { value: 'Gedung H', label: 'Gedung H' },
  ];

  const currentDenahImage = `/denah-gedung-${selectedBuilding.replace(' ', '-').toLowerCase()}.jpg`;

  // Handle klik pada gambar denah
  const handleImageClick = (e) => {
    if (!imageContainerRef.current) return;

    // Mendapatkan posisi div pembungkus gambar relatif terhadap viewport
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // Menghitung posisi klik relatif terhadap gambar (dalam piksel)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Menghitung posisi sebagai persentase dari lebar/tinggi gambar
    // Ini penting agar posisi pin tetap konsisten saat gambar menyesuaikan ukuran
    const xPercentage = x / rect.width;
    const yPercentage = y / rect.height;

    setPinPosition({ x: xPercentage, y: yPercentage });
    setError(''); // Clear error if any
  };

  // Handle simpan lokasi
  const handleSaveLocation = async () => {
    if (!pinPosition) {
      setError('Mohon tentukan lokasi APAR di denah.');
      return;
    }

    setSuccessMessage('');
    setError('');

    // Data yang akan dikirim ke backend
    const locationData = {
      aparId: aparId, // Ganti dengan ID APAR aktual
      gedung: selectedBuilding,
      // Simpan koordinat sebagai persentase untuk responsivitas
      coordinateX: pinPosition.x,
      coordinateY: pinPosition.y,
      // Anda mungkin juga ingin menyimpan ukuran asli gambar denah untuk referensi
      // atau menyimpan 'lokasiSpesifik' dalam bentuk teks jika ada
    };

    console.log('Menyimpan lokasi APAR:', locationData);
    setSuccessMessage(`Lokasi APAR ${aparId} di ${selectedBuilding} berhasil disimpan!`);

    // TODO: Di sini nanti Anda akan mengirim data ke API backend Anda
    // Contoh:
    // try {
    //   const response = await fetch('/api/apar/set-location', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(locationData),
    //   });
    //   if (response.ok) {
    //     setSuccessMessage(`Lokasi APAR ${aparId} berhasil disimpan!`);
    //     // Mungkin redirect atau tampilkan opsi lanjutan
    //   } else {
    //     const errorData = await response.json();
    //     setError(errorData.message || 'Gagal menyimpan lokasi.');
    //   }
    // } catch (err) {
    //   setError('Terjadi kesalahan jaringan.');
    //   console.error(err);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Tentukan Lokasi APAR {aparId}</h1>
        <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>
          Kembali ke Dashboard
        </Link>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Pilih Gedung dan Tentukan Titik Lokasi pada Denah</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Pemilihan Gedung */}
        <div className="mb-6">
          <label htmlFor="gedungSelect" className="block text-gray-700 text-sm font-bold mb-2">
            Pilih Gedung:
          </label>
          <select
            id="gedungSelect"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 max-w-xs"
            value={selectedBuilding}
            onChange={(e) => {
                setSelectedBuilding(e.target.value);
                setPinPosition(null); // Reset pin saat gedung berubah
                setError('');
                setSuccessMessage('');
            }}
          >
            {gedungOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Area Denah Gedung */}
        <div className="relative w-full overflow-hidden border border-gray-300 rounded-lg shadow-inner" style={{ aspectRatio: '16/9' }}> {/* Menggunakan aspect ratio agar responsif */}
          <div 
            ref={imageContainerRef}
            className="relative w-full h-full cursor-crosshair"
            onClick={handleImageClick}
          >
            <Image
              src={currentDenahImage}
              alt={`Denah ${selectedBuilding}`}
              layout="fill" // Gunakan layout="fill" untuk gambar yang memenuhi parent-nya
              objectFit="contain" // Pastikan gambar tidak terdistorsi dan terlihat penuh
              className="rounded-lg"
              priority // Muat gambar ini lebih awal
            />
            {pinPosition && (
              <div
                className="absolute bg-red-500 rounded-full w-4 h-4 border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pinPosition.x * 100}%`, top: `${pinPosition.y * 100}%` }}
              >
                {/* Anda bisa menambahkan ikon APAR kecil di sini */}
              </div>
            )}
          </div>
        </div>
        
        {pinPosition && (
          <p className="text-gray-600 text-center mt-4 text-sm">
            Titik terpilih: X: {(pinPosition.x * 100).toFixed(2)}%, Y: {(pinPosition.y * 100).toFixed(2)}%
          </p>
        )}

        {/* Tombol Simpan Lokasi */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleSaveLocation}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Simpan Lokasi APAR
          </button>
        </div>
      </div>
    </div>
  );
}