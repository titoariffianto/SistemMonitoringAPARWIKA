"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListAparPage() {
  const [aparList, setAparList] = useState([]);
  const [filteredGedung, setFilteredGedung] = useState("Semua");

  useEffect(() => {
    const dummyData = [
      {
        aparId: "APAR-GDG-F-001",
        jenisApar: "CO2",
        kapasitas: "6 kg",
        merek: "ABC Fire",
        tanggalPengadaan: "2024-01-15",
        tanggalKadaluarsa: "2026-01-15",
        gedung: "Gedung F",
        lokasiSpesifik: "Lantai 1, Dekat Lift",
        keterangan: "Dekat panel listrik",
      },
      {
        aparId: "APAR-GDG-G-002",
        jenisApar: "Powder",
        kapasitas: "9 kg",
        merek: "Jaya Proteksi",
        tanggalPengadaan: "2023-08-10",
        tanggalKadaluarsa: "2025-08-10",
        gedung: "Gedung G",
        lokasiSpesifik: "Lantai 2, Lorong Tengah",
        keterangan: "",
      },
    ];
    setAparList(dummyData);
  }, []);

  const handleDelete = (id) => {
    const confirmed = confirm("Yakin ingin menghapus data APAR ini?");
    if (confirmed) {
      setAparList(prev => prev.filter(item => item.aparId !== id));
    }
  };

  const gedungOptions = ["Semua", ...new Set(aparList.map(item => item.gedung))];
  const dataTampil = filteredGedung === "Semua" ? aparList : aparList.filter(item => item.gedung === filteredGedung);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-200 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-black">Daftar Seluruh APAR</h1>

        <div className="flex items-center gap-2">
          <label htmlFor="filterGedung" className="text-sm text-black font-medium">Filter Gedung:</label>
          <select
            id="filterGedung"
            value={filteredGedung}
            onChange={(e) => setFilteredGedung(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm text-black"
          >
            {gedungOptions.map((gedung, idx) => (
              <option key={idx} value={gedung}>{gedung}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-4 py-2 text-left">ID APAR</th>
              <th className="px-4 py-2 text-left">Jenis</th>
              <th className="px-4 py-2 text-left">Kapasitas</th>
              <th className="px-4 py-2 text-left">Merek</th>
              <th className="px-4 py-2 text-left">Tgl Pengadaan</th>
              <th className="px-4 py-2 text-left">Tgl Kadaluarsa</th>
              <th className="px-4 py-2 text-left">Gedung</th>
              <th className="px-4 py-2 text-left">Lokasi</th>
              <th className="px-4 py-2 text-left">Keterangan</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-black">
            {dataTampil.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                  Tidak ada data APAR untuk filter ini.
                </td>
              </tr>
            ) : (
              dataTampil.map((apar, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{apar.aparId}</td>
                  <td className="px-4 py-2">{apar.jenisApar}</td>
                  <td className="px-4 py-2">{apar.kapasitas}</td>
                  <td className="px-4 py-2">{apar.merek || '-'}</td>
                  <td className="px-4 py-2">{apar.tanggalPengadaan}</td>
                  <td className="px-4 py-2">{apar.tanggalKadaluarsa}</td>
                  <td className="px-4 py-2">{apar.gedung}</td>
                  <td className="px-4 py-2">{apar.lokasiSpesifik}</td>
                  <td className="px-4 py-2">{apar.keterangan || '-'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link href={`/apar/edit/${apar.aparId}`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(apar.aparId)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
