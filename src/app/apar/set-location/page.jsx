"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SetLocationPage() {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [pinPosition, setPinPosition] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const imageContainerRef = useRef(null);
  const aparId = "APAR-XXX"; 

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
    if (selectedBuilding && denahImages[selectedBuilding]) {
      return [
        { value: '', label: 'Pilih Lantai' },
        ...Object.keys(denahImages[selectedBuilding]).map(key => ({ value: key, label: key }))
      ];
    }
    return [{ value: '', label: 'Pilih Lantai' }];
  }, [selectedBuilding]);

  const currentDenahImageSrc = useMemo(() => {
    if (selectedBuilding && selectedFloor && denahImages[selectedBuilding] && denahImages[selectedBuilding][selectedFloor]) {
      return denahImages[selectedBuilding][selectedFloor];
    }
    return null;
  }, [selectedBuilding, selectedFloor]);


  const handleImageClick = (e) => {
    if (!currentDenahImageSrc || !imageContainerRef.current) {
        setError('Pilih Gedung dan Lantai terlebih dahulu untuk menentukan lokasi.');
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

  const handleSaveLocation = async () => {
    if (!pinPosition) {
      setError('Mohon tentukan lokasi APAR di denah.');
      return;
    }
    if (!selectedBuilding || !selectedFloor) {
        setError('Mohon pilih Gedung dan Lantai terlebih dahulu.');
        return;
    }

    setSuccessMessage('');
    setError('');

    const locationData = {
      aparId: aparId, 
      gedung: selectedBuilding,
      lantai: selectedFloor,
      coordinateX: pinPosition.x,
      coordinateY: pinPosition.y,
    };

    console.log('Menyimpan lokasi APAR:', locationData);
    setSuccessMessage(`Lokasi APAR ${aparId} di ${selectedBuilding}, ${selectedFloor} berhasil disimpan!`);

    // TODO: Di sini nanti Anda akan mengirim data ke API backend Anda
  };

  useEffect(() => {
    setPinPosition(null);
    setError('');
    setSuccessMessage('');
  }, [selectedBuilding, selectedFloor]);


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
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Pilih Lokasi di Denah</h2>

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

        {/* Pemilihan Gedung dan Lantai */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="gedungSelect" className="block text-gray-700 text-sm font-bold mb-2">
              Pilih Gedung: <span className="text-red-500">*</span>
            </label>
            <select
              id="gedungSelect"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={selectedBuilding}
              onChange={(e) => {
                  setSelectedBuilding(e.target.value);
                  setSelectedFloor(''); // Reset lantai saat gedung berubah
              }}
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
            <label htmlFor="floorSelect" className="block text-gray-700 text-sm font-bold mb-2">
              Pilih Lantai: <span className="text-red-500">*</span>
            </label>
            {/* Perhatian: Pastikan semua properti ada di dalam tag <select> yang sama! */}
            <select
              id="floorSelect"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              required
              disabled={!selectedBuilding || floorOptions.length <= 1 || selectedBuilding === ''}
            >
              {floorOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
            {!selectedBuilding && <p className="text-xs text-gray-500 mt-1">Pilih gedung terlebih dahulu.</p>}
          </div>
        </div>

        {/* Area Denah Gedung */}
        <div className="relative w-full overflow-hidden border border-gray-300 rounded-lg shadow-inner" style={{ aspectRatio: '16/9' }}>
          {currentDenahImageSrc ? (
            <div 
              ref={imageContainerRef}
              className="relative w-full h-full cursor-crosshair"
              onClick={handleImageClick}
            >
              <Image
                src={currentDenahImageSrc}
                alt={`Denah ${selectedBuilding} - ${selectedFloor}`}
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