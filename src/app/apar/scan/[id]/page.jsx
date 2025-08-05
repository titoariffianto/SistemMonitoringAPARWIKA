"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ScanAparPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [apar, setApar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- State untuk Form Inspeksi yang Disesuaikan ---
  const [tekanan, setTekanan] = useState('');
  const [segel, setSegel] = useState('');
  const [selang, setSelang] = useState('');
  const [tabung, setTabung] = useState('');
  const [status, setStatus] = useState('');
  const [foto, setFoto] = useState(null); // File input untuk foto
  const [catatan, setCatatan] = useState(''); // Mengganti 'keterangan'
  // --- Akhir State yang Disesuaikan ---

  // Pilihan untuk dropdown form inspeksi
  const tekananOptions = ['Normal', 'Kurang'];
  const segelOptions = ['Terpasang', 'Rusak', 'Hilang'];
  const selangOptions = ['Baik', 'Rusak', 'Tersumbat'];
  const tabungOptions = ['Baik', 'Berkarat', 'Penyok'];
  const statusOptions = ['Normal', 'Perlu Isi Ulang', 'Perlu Perbaikan', 'Expired'];

  useEffect(() => {
    if (!id) return;

    const fetchAparDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Anda harus login untuk mengakses halaman ini.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/apar/details/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setApar(result.data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Gagal mengambil detail APAR.');
        }
      } catch (err) {
        setError('Terjadi kesalahan jaringan atau server tidak dapat dijangkau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAparDetails();
  }, [id]);

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!tekanan || !segel || !selang || !tabung || !status) {
        setError('Mohon lengkapi semua bidang inspeksi yang wajib diisi.');
        return;
    }

    const inspectionData = {
        aparId: apar.id,
        tekanan,
        segel,
        selang,
        tabung,
        status,
        catatan,
        // TODO: Tambahkan penanganan foto
    };

    console.log('Data inspeksi yang dikirim:', inspectionData);
    setSuccessMessage('Data inspeksi berhasil disimpan (simulasi)!');

    // TODO: Implementasi logika kirim data inspeksi ke API backend baru
    // Contoh: POST ke /api/apar/inspect/:id dengan data form
    // try {
    //    const token = localStorage.getItem('token');
    //    const response = await fetch(`http://localhost:5000/api/apar/inspect/${apar.id}`, {
    //        method: 'POST',
    //        headers: {
    //            'Content-Type': 'application/json',
    //            'Authorization': `Bearer ${token}`,
    //        },
    //        body: JSON.stringify(inspectionData),
    //    });
    //    if (response.ok) {
    //        setSuccessMessage('Data inspeksi berhasil disimpan!');
    //        // Opsional: Redirect ke halaman lain
    //    } else {
    //        const errorData = await response.json();
    //        setError(errorData.message || 'Gagal menyimpan data inspeksi.');
    //    }
    // } catch (err) {
    //    setError('Terjadi kesalahan jaringan.');
    // }
  };

  const handleUbahLokasiClick = () => {
    if (apar) {
      router.push(`/apar/set-location/${apar.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-xl text-blue-600">Memuat detail APAR...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!apar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-xl text-gray-700">APAR tidak ditemukan atau data kosong.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 font-inter">
      <header className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-800 text-center sm:text-left">Detail APAR: {apar.apar_id}</h1>
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
        {/* Bagian Informasi APAR */}
        <h2 className="text-2xl font-bold text-gray-800 mb-7 text-center">Informasi APAR</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mb-8">
            <p className="text-gray-700"><strong>Jenis APAR:</strong> {apar.jenis_apar}</p>
            <p className="text-gray-700"><strong>Kapasitas:</strong> {apar.kapasitas}</p>
            <p className="text-gray-700"><strong>Merek:</strong> {apar.merek || '-'}</p>
            <p className="text-gray-700"><strong>Tanggal Pengadaan:</strong> {apar.tanggal_pengadaan}</p>
            <p className="text-gray-700"><strong>Masa Berlaku Media:</strong> {apar.tanggal_kadaluarsa}</p>
            <p className="text-gray-700"><strong>Lokasi:</strong> {apar.gedung || '-'} - {apar.lokasi_spesifik || '-'}</p>
        </div>

        {/* Tombol Aksi Kondisional */}
        <div className="mt-8 flex justify-center space-x-4">
          {apar.jenis_penempatan === 'non-permanen' ? (
            <button
              onClick={handleUbahLokasiClick}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Ubah Lokasi
            </button>
          ) : (
            <Link
              href={`/apar/locations/${apar.gedung}/${apar.lokasi_spesifik}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Lihat Lokasi di Denah
            </Link>
          )}
        </div>
        
        <hr className="my-8" />

        {/* Bagian Formulir Inspeksi yang Disesuaikan */}
        <h2 className="text-2xl font-bold text-gray-800 mb-7 text-center">Formulir Inspeksi</h2>
        {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm mb-4" role="alert">
                {successMessage}
            </div>
        )}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-4" role="alert">
                {error}
            </div>
        )}

        <form onSubmit={handleInspectionSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Tekanan */}
            <div>
              <label htmlFor="tekanan" className="block text-gray-700 text-sm font-medium mb-2">Tekanan</label>
              <select id="tekanan" value={tekanan} onChange={(e) => setTekanan(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option value="">Pilih Tekanan</option>
                {tekananOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {/* Segel */}
            <div>
              <label htmlFor="segel" className="block text-gray-700 text-sm font-medium mb-2">Segel</label>
              <select id="segel" value={segel} onChange={(e) => setSegel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option value="">Pilih Kondisi Segel</option>
                {segelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {/* Selang */}
            <div>
              <label htmlFor="selang" className="block text-gray-700 text-sm font-medium mb-2">Selang</label>
              <select id="selang" value={selang} onChange={(e) => setSelang(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option value="">Pilih Kondisi Selang</option>
                {selangOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {/* Tabung */}
            <div>
              <label htmlFor="tabung" className="block text-gray-700 text-sm font-medium mb-2">Tabung</label>
              <select id="tabung" value={tabung} onChange={(e) => setTabung(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option value="">Pilih Kondisi Tabung</option>
                {tabungOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-gray-700 text-sm font-medium mb-2">Status APAR</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option value="">Pilih Status</option>
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {/* Foto */}
            <div>
              <label htmlFor="foto" className="block text-gray-700 text-sm font-medium mb-2">Foto</label>
              <input type="file" id="foto" onChange={(e) => setFoto(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800" />
            </div>
          </div>
          <div>
            <label htmlFor="catatan" className="block text-gray-700 text-sm font-medium mb-2">Catatan Inspeksi</label>
            <textarea
              id="catatan"
              rows="3"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tambahkan catatan jika ada..."
            ></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Simpan Inspeksi
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}