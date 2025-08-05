"use client";

import Link from 'next/link';
import { useEffect, useState, useMemo, useRef } from 'react'; // Tambahkan useRef
import Image from 'next/image'; // Import Image untuk menampilkan QR di modal
import html2pdf from 'html2pdf.js'; // Import library html2pdf

export default function ListAparPage() {
  const [aparList, setAparList] = useState([]);
  const [filteredGedung, setFilteredGedung] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // --- State Baru untuk Modal QR Code ---
  const [showQrModal, setShowQrModal] = useState(false);
  const [modalQrCodeUrl, setModalQrCodeUrl] = useState(null);
  const [modalAparId, setModalAparId] = useState(null);
  const qrCodePrintRef = useRef(null); // Ref untuk elemen di dalam modal yang akan di-PDF
  // --- Akhir State Baru ---

  const gedungOptions = useMemo(() => {
    const allGedung = aparList.map(apar => apar.gedung).filter(Boolean);
    const uniqueGedung = [...new Set(allGedung)];
    return ["Semua", ...uniqueGedung];
  }, [aparList]);

  const dataTampil = useMemo(() => {
    let filteredData = aparList;

    if (filteredGedung !== "Semua") {
      filteredData = filteredData.filter(apar => apar.gedung === filteredGedung);
    }

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredData = filteredData.filter(apar => 
            apar.apar_id.toLowerCase().includes(lowerCaseSearchTerm) ||
            apar.jenis_apar.toLowerCase().includes(lowerCaseSearchTerm) ||
            apar.gedung.toLowerCase().includes(lowerCaseSearchTerm) ||
            (apar.lokasi_spesifik && apar.lokasi_spesifik.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (apar.merek && apar.merek.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }

    return filteredData;
  }, [aparList, filteredGedung, searchTerm]);


  useEffect(() => {
    const fetchAparList = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Anda harus login untuk melihat daftar APAR.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/apar/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAparList(result.data); 
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Gagal mengambil daftar APAR. Pastikan Anda memiliki izin.');
          console.error('API Error:', errorData);
        }
      } catch (err) {
        setError('Terjadi kesalahan jaringan atau server tidak dapat dijangkau.');
        console.error('Network error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAparList();
  }, []);

  const handleDelete = async (aparIdToDelete) => {
    const confirmed = confirm(`Yakin ingin menghapus APAR dengan ID: ${aparIdToDelete}?`);
    if (confirmed) {
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Anda harus login untuk menghapus APAR.');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/apar/${aparIdToDelete}`, { // Contoh endpoint DELETE
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            alert(`APAR ${aparIdToDelete} berhasil dihapus!`);
            setAparList(prev => prev.filter(item => item.apar_id !== aparIdToDelete));
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Gagal menghapus APAR. Pastikan Anda memiliki izin.');
            console.error('API Error:', errorData);
        }
      } catch (err) {
        setError('Terjadi kesalahan jaringan atau server tidak dapat dijangkau.');
        console.error('Network error:', err);
      }
    }
  };

  // --- FUNGSI BARU: Membuka Modal QR Code ---
  const handleOpenQrModal = (aparIdentifier, qrCodeDataUrl) => {
    if (qrCodeDataUrl) {
      setModalAparId(aparIdentifier);
      setModalQrCodeUrl(qrCodeDataUrl);
      setShowQrModal(true); // Tampilkan modal
    } else {
        alert('QR Code tidak tersedia untuk APAR ini.');
    }
  };

  // --- FUNGSI BARU: Menutup Modal QR Code ---
  const handleCloseQrModal = () => {
    setShowQrModal(false);
    setModalAparId(null);
    setModalQrCodeUrl(null);
  };

  // --- FUNGSI BARU: Mencetak QR Code ke PDF dari Modal ---
  const handlePrintToPdf = () => {
    if (qrCodePrintRef.current) {
      // Konfigurasi untuk PDF
      const opt = {
        margin:       [10, 10, 10, 10], // top, left, bottom, right
        filename:     `QR_APAR_${modalAparId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 }, // Meningkatkan skala untuk kualitas gambar yang lebih baik
        jsPDF:        { unit: 'mm', format: 'a5', orientation: 'portrait' } // Mengatur format kertas (misal A5 portrait)
      };

      // Buat PDF dari elemen yang direferensikan
      html2pdf().set(opt).from(qrCodePrintRef.current).save();
    }
  };
  // --- AKHIR FUNGSI BARU ---


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 font-inter">
      <header className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-800 text-center sm:text-left">Daftar Seluruh APAR</h1>
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
                type="text"
                placeholder="Cari ID, Jenis, Lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="filterGedung" className="text-gray-700 text-sm font-medium">Filter Gedung:</label>
                <select
                    id="filterGedung"
                    value={filteredGedung}
                    onChange={(e) => setFilteredGedung(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                >
                    {gedungOptions.map((gedung, idx) => (
                        <option key={idx} value={gedung}>{gedung}</option>
                    ))}
                </select>
            </div>
        </div>
        
        {loading && <div className="text-center py-4 text-blue-600">Memuat data APAR...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID APAR</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jenis</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kapasitas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Merek</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tgl Pengadaan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tgl Kadaluarsa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gedung</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Lokasi Spesifik</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jenis Penempatan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Keterangan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataTampil.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-4 py-4 text-center text-gray-500">
                    {loading ? "Memuat..." : "Tidak ada data APAR yang ditemukan."}
                  </td>
                </tr>
              ) : (
                dataTampil.map((apar) => (
                  <tr key={apar.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{apar.apar_id}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.jenis_apar}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.kapasitas}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.merek || '-'}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.tanggal_pengadaan}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.tanggal_kadaluarsa}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.gedung || '-'}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.lokasi_spesifik || '-'}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.jenis_penempatan}</td>
                    <td className="px-4 py-2 text-gray-800">{apar.keterangan || '-'}</td>
                    <td className="px-4 py-2 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <Link href={`/apar/edit/${apar.apar_id}`} className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Edit</Link>
                      {/* Tombol Cetak QR - Membuka Modal */}
                      <button 
                        onClick={() => handleOpenQrModal(apar.apar_id, apar.qr_code_url)} 
                        className="text-green-600 hover:text-green-800 font-medium whitespace-nowrap"
                        disabled={!apar.qr_code_url}
                      >
                        Cetak QR
                      </button>
                      <button onClick={() => handleDelete(apar.apar_id)} className="text-red-600 hover:text-red-800 font-medium whitespace-nowrap">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL QR Code --- */}
      {showQrModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
            <button
              onClick={handleCloseQrModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">QR Code APAR {modalAparId}</h3>
            
            <div ref={qrCodePrintRef} className="inline-block p-4 bg-white rounded-lg shadow-md border border-gray-200">
              {modalQrCodeUrl ? (
                <Image
                  src={modalQrCodeUrl}
                  alt={`QR Code untuk APAR ${modalAparId}`}
                  width={250} // Ukuran lebih besar untuk modal
                  height={250}
                  className="mx-auto"
                />
              ) : (
                <p className="text-red-500">QR Code tidak dapat ditampilkan.</p>
              )}
              <p className="mt-2 text-gray-700 text-sm font-semibold">Scan QR ini untuk inspeksi</p>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handlePrintToPdf}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6m-3-4v4m-6-3H2m.002 3H22"></path></svg>
                Cetak ke PDF
              </button>
              <button
                onClick={handleCloseQrModal}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- AKHIR MODAL QR Code --- */}
    </div>
  );
}  