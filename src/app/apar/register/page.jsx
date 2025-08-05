"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterAparPage() {
  const [aparId, setAparId] = useState('');
  const [jenisApar, setJenisApar] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [merek, setMerek] = useState('');
  const [tanggalPengadaan, setTanggalPengadaan] = useState('');
  const [tanggalKadaluarsa, setTanggalKadaluarsa] = useState('');
  
  const [jenisPenempatan, setJenisPenempatan] = useState('');
  const [gedung, setGedung] = useState('');
  const [lokasiSpesifik, setLokasiSpesifik] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [registeredAparId, setRegisteredAparId] = useState('');
  const [pinPosition, setPinPosition] = useState(null); 

  const imageContainerRef = useRef(null);
  const printQrRef = useRef(null);

  // Pilihan Jenis APAR
  const jenisAparOptions = [
    { value: '', label: 'Pilih Jenis APAR' },
    { value: 'Air', label: 'Air (Water)' },
    { value: 'Busa', label: 'Busa (Foam)' },
    { value: 'Powder', label: 'Serbuk Kimia (Dry Chemical Powder)' },
    { value: 'CO2', label: 'Karbon Dioksida (CO2)' },
    { value: 'Clean Agent', label: 'Clean Agent' },
  ];

  const denahImages = {
    "Gedung F": {
      "Lt Basement": "/denah-gedung-f-lt-basement.jpg",
      "Lt Semi-Basement": "/denah-gedung-f-lt-semi-basement.jpg",
      "Lantai 1": "/denah-gedung-f-lantai-1.jpg",
      "Lantai 2": "/denah-gedung-f-lantai-2.jpg",
      "Lantai 3": "/denah-gedung-f-lantai-3.jpg",
      "Lantai 4": "/denah-gedung-f-lantai-4.jpg",
      "Lantai 5": "/denah-gedung-f-lantai-5.jpg",
      "Lantai 6": "/denah-gedung-f-lantai-6.jpg",
    },
    "Gedung G": {
      "Lt Basement": "/denah-gedung-g-lt-basement.jpg",
      "Lt Semi-Basement": "/denah-gedung-g-lt-semi-basement.jpg",
      "Lantai 1": "/denah-gedung-g-lantai-1.jpg",
      "Lantai 2": "/denah-gedung-g-lantai-2.jpg",
      "Lantai 3": "/denah-gedung-g-lantai-3.jpg",
      "Lantai 4": "/denah-gedung-g-lantai-4.jpg",
      "Lantai 5": "/denah-gedung-g-lantai-5.jpg",
      "Lantai 6": "/denah-gedung-g-lantai-6.jpg",
    },
    "Gedung H": {
      "Lt Basement": "/denah-gedung-h-lt-basement.jpg",
      "Lt Semi-Basement": "/denah-gedung-h-lt-semi-basement.jpg",
      "Lantai 1": "/denah-gedung-h-lantai-1.jpg",
      "Lantai 2": "/denah-gedung-h-lantai-2.jpg",
    },
  };

  const gedungOptions = [
    { value: '', label: 'Pilih Gedung' },
    ...Object.keys(denahImages).map(key => ({ value: key, label: key }))
  ];

  const floorOptions = useMemo(() => {
    if (gedung && denahImages[gedung]) {
      return [
        { value: '', label: 'Pilih Lantai' },
        ...Object.keys(denahImages[gedung]).map(key => ({ value: key, label: key }))
      ];
    }
    return [{ value: '', label: 'Pilih Lantai' }];
  }, [gedung]);

  const currentDenahImageSrc = useMemo(() => {
    if (gedung && lokasiSpesifik && denahImages[gedung] && denahImages[gedung][lokasiSpesifik]) {
      return denahImages[gedung][lokasiSpesifik];
    }
    return null;
  }, [gedung, lokasiSpesifik]);

  const handleImageClick = (e) => {
    if (!currentDenahImageSrc || !imageContainerRef.current) {
        setError('Pilih Gedung dan Lantai terlebih dahulu untuk menentukan lokasi di denah.');
        return;
    }

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercentage = x / rect.width;
    const yPercentage = y / rect.height;

    setPinPosition({ x: xPercentage, y: yPercentage });
    setError('');
  };

  useEffect(() => {
    setPinPosition(null);
    setError('');
    setSuccessMessage('');
    setQrCodeDataUrl(null);
  }, [gedung, lokasiSpesifik, jenisPenempatan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setQrCodeDataUrl(null);
    setRegisteredAparId('');

    if (!aparId || !jenisApar || !kapasitas || !tanggalPengadaan || !tanggalKadaluarsa || !jenisPenempatan) {
      setError('Mohon lengkapi semua bidang wajib (*).');
      return;
    }

    if (jenisPenempatan === 'permanen') {
        if (!gedung || gedung === '' || !lokasiSpesifik || lokasiSpesifik === 'Pilih Lantai') {
            setError('Untuk penempatan Permanen, Gedung dan Lantai wajib diisi.');
            return;
        }
        if (!pinPosition) {
            setError('Untuk penempatan Permanen, mohon tentukan lokasi di denah.');
            return;
        }
    }
    
    const aparData = {
      aparId,
      jenisApar,
      kapasitas,
      merek,
      tanggalPengadaan,
      tanggalKadaluarsa,
      jenisPenempatan,
      gedung: jenisPenempatan === 'permanen' ? gedung : null,
      lokasiSpesifik: jenisPenempatan === 'permanen' ? lokasiSpesifik : null,
      coordinateX: jenisPenempatan === 'permanen' && pinPosition ? pinPosition.x : null,
      coordinateY: jenisPenempatan === 'permanen' && pinPosition ? pinPosition.y : null,
      keterangan,
    };

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Anda harus login untuk mendaftarkan APAR.');
            return;
        }

        const response = await fetch('http://localhost:5000/api/apar/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(aparData),
        });

        if (response.ok) {
            const result = await response.json();
            setSuccessMessage(`APAR ${result.aparIdentifier} berhasil didaftarkan! Silakan cetak QR Code.`);
            setQrCodeDataUrl(result.qrCodeDataUrl);
            setRegisteredAparId(result.aparIdentifier);

            setAparId('');
            setJenisApar('');
            setKapasitas('');
            setMerek('');
            setTanggalPengadaan('');
            setTanggalKadaluarsa('');
            setJenisPenempatan('');
            setGedung('');
            setLokasiSpesifik('');
            setKeterangan('');
            setPinPosition(null); 
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Gagal mendaftarkan APAR. Pastikan Anda memiliki izin.');
            console.error('API Error:', errorData);
        }
    } catch (err) {
        setError('Terjadi kesalahan jaringan atau server tidak dapat dijangkau.');
        console.error('Network error:', err);
    }
  };

  const handleGedungChange = (e) => {
    const selectedGedung = e.target.value;
    setGedung(selectedGedung);
    setLokasiSpesifik('');
  };

  const handlePrintQr = () => {
    if (printQrRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Cetak QR Code</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('body { font-family: sans-serif; text-align: center; margin: 20px; }');
      printWindow.document.write('img { max-width: 300px; height: auto; margin-bottom: 20px; border: 1px solid #ccc; padding: 10px; }');
      printWindow.document.write('p { font-size: 1.2em; font-weight: bold; }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<p>QR Code untuk APAR ID: ${registeredAparId}</p>`);
      printWindow.document.write(`<img src="${qrCodeDataUrl}" alt="QR Code APAR ${registeredAparId}" />`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 font-inter">
      <header className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-800 text-center sm:text-left">Daftar APAR Baru</h1>
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

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 text-center">Form Pendaftaran APAR</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {successMessage}
            </div>
          )}

          {/* Bagian Input Form APAR */}
          <div>
            <label htmlFor="aparId" className="block text-gray-700 text-sm font-medium mb-2">
              Nomor Seri / ID Unik APAR <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="aparId"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
              placeholder="Contoh: APAR-GDG-F-001"
              value={aparId}
              onChange={(e) => setAparId(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="jenisApar" className="block text-gray-700 text-sm font-medium mb-2">
              Jenis APAR <span className="text-red-500">*</span>
            </label>
            <select
              id="jenisApar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
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

          <div>
            <label htmlFor="kapasitas" className="block text-gray-700 text-sm font-medium mb-2">
              Kapasitas / Ukuran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="kapasitas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
              placeholder="Contoh: 6 kg, 9 liter"
              value={kapasitas}
              onChange={(e) => setKapasitas(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="merek" className="block text-gray-700 text-sm font-medium mb-2">
              Merek / Produsen
            </label>
            <input
              type="text"
              id="merek"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
              placeholder="Contoh: ABC Fire, Jaya Proteksi"
              value={merek}
              onChange={(e) => setMerek(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="tanggalPengadaan" className="block text-gray-700 text-sm font-medium mb-2">
              Tanggal Pengadaan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalPengadaan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              value={tanggalPengadaan}
              onChange={(e) => setTanggalPengadaan(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="tanggalKadaluarsa" className="block text-gray-700 text-sm font-medium mb-2">
              Tanggal Kadaluarsa Media <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalKadaluarsa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              value={tanggalKadaluarsa}
              onChange={(e) => setTanggalKadaluarsa(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Jenis Penempatan APAR <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 h-4 w-4"
                  name="jenisPenempatan"
                  value="permanen"
                  checked={jenisPenempatan === 'permanen'}
                  onChange={(e) => {
                    setJenisPenempatan(e.target.value);
                    if (e.target.value === 'non-permanen') { 
                        setGedung('');
                        setLokasiSpesifik('');
                    }
                  }}
                  required
                />
                <span className="ml-2 text-gray-700">Permanen (Posisi Tetap)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 h-4 w-4"
                  name="jenisPenempatan"
                  value="non-permanen"
                  checked={jenisPenempatan === 'non-permanen'}
                  onChange={(e) => {
                    setJenisPenempatan(e.target.value);
                    setGedung('');
                    setLokasiSpesifik('');
                  }}
                  required
                />
                <span className="ml-2 text-gray-700">Non-Permanen (Posisi Berpindah)</span>
              </label>
            </div>
          </div>

          {/* Conditional Rendering untuk Lokasi (Gedung, Lantai, dan Denah Interaktif) */}
          {jenisPenempatan === 'permanen' && (
            <>
              <div>
                <label htmlFor="gedung" className="block text-gray-700 text-sm font-medium mb-2">
                  Gedung <span className="text-red-500">*</span>
                </label>
                <select
                  id="gedung"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  value={gedung}
                  onChange={handleGedungChange}
                  required
                >
                  {gedungOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="lokasiSpesifik" className="block text-gray-700 text-sm font-medium mb-2">
                  Lantai <span className="text-red-500">*</span>
                </label>
                <select
                  id="lokasiSpesifik"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  value={lokasiSpesifik}
                  onChange={(e) => setLokasiSpesifik(e.target.value)}
                  required
                  disabled={!gedung || floorOptions.length <= 1 || lokasiSpesifik === 'Pilih Lantai'}
                >
                  {floorOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {!gedung && <p className="text-xs text-gray-500 mt-1">Pilih gedung terlebih dahulu untuk melihat daftar lantai.</p>}
                {gedung && floorOptions.length <= 1 && <p className="text-xs text-gray-500 mt-1">Tidak ada lantai tersedia untuk gedung ini.</p>}
              </div>

              <div className="pt-2">
                <p className="block text-gray-700 text-sm font-medium mb-2">
                  Tentukan Titik Lokasi pada Denah: <span className="text-red-500">*</span>
                </p>
                <div className="relative w-full overflow-hidden border border-gray-300 rounded-lg shadow-inner" style={{ aspectRatio: '16/9' }}>
                  {currentDenahImageSrc ? (
                    <div 
                      ref={imageContainerRef}
                      className="relative w-full h-full cursor-crosshair"
                      onClick={handleImageClick}
                    >
                      <Image
                        src={currentDenahImageSrc}
                        alt={`Denah ${gedung} - ${lokasiSpesifik}`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                        priority
                      />
                      {pinPosition && (
                        <div
                          className="absolute bg-red-500 rounded-full w-4 h-4 border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${pinPosition.x * 100}%`, top: `${pinPosition.y * 100}%` }}
                        >
                          {/* Ikon APAR di sini */}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                      Pilih Gedung dan Lantai untuk menampilkan denah.
                    </div>
                  )}
                </div>
                
                {pinPosition && (
                  <p className="text-gray-600 text-center mt-2 text-sm">
                    Titik terpilih: X: {(pinPosition.x * 100).toFixed(2)}%, Y: {(pinPosition.y * 100).toFixed(2)}%
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="keterangan" className="block text-gray-700 text-sm font-medium mb-2">
              Keterangan Tambahan
            </label>
            <textarea
              id="keterangan"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
              placeholder="Catatan tambahan mengenai APAR ini..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            ></textarea>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Daftarkan APAR
            </button>
          </div>
        </form>

        {/* Bagian Tampilan QR Code (Setelah Sukses Mendaftar) */}
        {qrCodeDataUrl && registeredAparId && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <h3 className="text-xl font-bold text-blue-800 mb-4">QR Code APAR {registeredAparId}</h3>
            <div ref={printQrRef} className="inline-block p-4 bg-white rounded-lg shadow-md">
              <Image 
                src={qrCodeDataUrl}
                alt={`QR Code untuk APAR ${registeredAparId}`}
                width={200}
                height={200}
                className="mx-auto"
              />
              <p className="mt-2 text-gray-700 text-sm font-semibold">Scan QR ini untuk inspeksi</p>
            </div>
            <div className="mt-6">
              <button
                onClick={handlePrintQr}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6m-3-4v4m-6-3H2m.002 3H22"></path></svg>
                Cetak QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}