"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterAparPage() {
  // State untuk setiap input form
  const [aparId, setAparId] = useState('');
  const [jenisApar, setJenisApar] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [merek, setMerek] = useState('');
  const [tanggalPengadaan, setTanggalPengadaan] = useState('');
  const [tanggalKadaluarsa, setTanggalKadaluarsa] = useState('');
  const [gedung, setGedung] = useState('');
  const [lokasiSpesifik, setLokasiSpesifik] = useState(''); // Untuk lokasi spesifik di dalam gedung
  const [keterangan, setKeterangan] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pilihan Jenis APAR
  const jenisAparOptions = [
    { value: '', label: 'Pilih Jenis APAR' },
    { value: 'Air', label: 'Air (Water)' },
    { value: 'Busa', label: 'Busa (Foam)' },
    { value: 'Powder', label: 'Serbuk Kimia (Dry Chemical Powder)' },
    { value: 'CO2', label: 'Karbon Dioksida (CO2)' },
    { value: 'Clean Agent', label: 'Clean Agent' },
  ];

  // Pilihan Gedung (sesuai yang kita diskusikan)
  const gedungOptions = [
    { value: '', label: 'Pilih Gedung' },
    { value: 'Gedung F', label: 'Gedung F' },
    { value: 'Gedung G', label: 'Gedung G' },
    { value: 'Gedung H', label: 'Gedung H' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validasi sederhana
    if (!aparId || !jenisApar || !kapasitas || !tanggalPengadaan || !tanggalKadaluarsa || !gedung || !lokasiSpesifik) {
      setError('Mohon lengkapi semua bidang yang wajib diisi.');
      return;
    }

    const aparData = {
      aparId,
      jenisApar,
      kapasitas,
      merek,
      tanggalPengadaan,
      tanggalKadaluarsa,
      gedung,
      lokasiSpesifik,
      keterangan,
    };

    console.log('Data APAR yang didaftarkan:', aparData);
    setSuccessMessage('APAR berhasil didaftarkan (simulasi)! QR Code akan dibuat.');

    // TODO: Di sini nanti Anda akan mengirim data ke API backend
    // Contoh:
    // try {
    //   const response = await fetch('/api/apar/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(aparData),
    //   });
    //   if (response.ok) {
    //     const result = await response.json();
    //     setSuccessMessage(`APAR ${aparId} berhasil didaftarkan. QR Code: ${result.qrCodeUrl}`);
    //     // Reset form
    //     setAparId('');
    //     setJenisApar('');
    //     setKapasitas('');
    //     setMerek('');
    //     setTanggalPengadaan('');
    //     setTanggalKadaluarsa('');
    //     setGedung('');
    //     setLokasiSpesifik('');
    //     setKeterangan('');
    //   } else {
    //     const errorData = await response.json();
    //     setError(errorData.message || 'Gagal mendaftarkan APAR.');
    //   }
    // } catch (err) {
    //   setError('Terjadi kesalahan jaringan.');
    //   console.error(err);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Daftar APAR Baru</h1>
        <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>
          Kembali ke Dashboard
        </Link>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Form Pendaftaran APAR</h2>

        <form onSubmit={handleSubmit}>
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

          {/* Nomor Seri/ID APAR */}
          <div className="mb-4">
            <label htmlFor="aparId" className="block text-gray-700 text-sm font-bold mb-2">
              Nomor Seri / ID Unik APAR <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="aparId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Contoh: APAR-GDG-F-001"
              value={aparId}
              onChange={(e) => setAparId(e.target.value)}
              required
            />
          </div>

          {/* Jenis APAR */}
          <div className="mb-4">
            <label htmlFor="jenisApar" className="block text-gray-700 text-sm font-bold mb-2">
              Jenis APAR <span className="text-red-500">*</span>
            </label>
            <select
              id="jenisApar"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={jenisApar}
              onChange={(e) => setJenisApar(e.target.value)}
              required
            >
              {jenisAparOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Kapasitas/Ukuran */}
          <div className="mb-4">
            <label htmlFor="kapasitas" className="block text-gray-700 text-sm font-bold mb-2">
              Kapasitas / Ukuran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="kapasitas"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Contoh: 6 kg, 9 liter"
              value={kapasitas}
              onChange={(e) => setKapasitas(e.target.value)}
              required
            />
          </div>

          {/* Merek/Produsen */}
          <div className="mb-4">
            <label htmlFor="merek" className="block text-gray-700 text-sm font-bold mb-2">
              Merek / Produsen
            </label>
            <input
              type="text"
              id="merek"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Contoh: ABC Fire, Jaya Proteksi"
              value={merek}
              onChange={(e) => setMerek(e.target.value)}
            />
          </div>

          {/* Tanggal Pengadaan */}
          <div className="mb-4">
            <label htmlFor="tanggalPengadaan" className="block text-gray-700 text-sm font-bold mb-2">
              Tanggal Pengadaan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalPengadaan"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={tanggalPengadaan}
              onChange={(e) => setTanggalPengadaan(e.target.value)}
              required
            />
          </div>

          {/* Tanggal Kadaluarsa Media */}
          <div className="mb-4">
            <label htmlFor="tanggalKadaluarsa" className="block text-gray-700 text-sm font-bold mb-2">
              Tanggal Kadaluarsa Media <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalKadaluarsa"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={tanggalKadaluarsa}
              onChange={(e) => setTanggalKadaluarsa(e.target.value)}
              required
            />
          </div>

          {/* Gedung */}
          <div className="mb-4">
            <label htmlFor="gedung" className="block text-gray-700 text-sm font-bold mb-2">
              Gedung <span className="text-red-500">*</span>
            </label>
            <select
              id="gedung"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={gedung}
              onChange={(e) => setGedung(e.target.value)}
              required
            >
              {gedungOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lokasi Spesifik */}
          <div className="mb-4">
            <label htmlFor="lokasiSpesifik" className="block text-gray-700 text-sm font-bold mb-2">
              Lokasi Spesifik (misal: Lantai 1, Ruang Genset) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lokasiSpesifik"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Contoh: Lantai 1, Dekat Lift"
              value={lokasiSpesifik}
              onChange={(e) => setLokasiSpesifik(e.target.value)}
              required
            />
          </div>

          {/* Keterangan Tambahan */}
          <div className="mb-6">
            <label htmlFor="keterangan" className="block text-gray-700 text-sm font-bold mb-2">
              Keterangan Tambahan
            </label>
            <textarea
              id="keterangan"
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Catatan tambahan mengenai APAR ini..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            ></textarea>
          </div>

          {/* Tombol Submit */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out"
            >
              Daftarkan APAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}