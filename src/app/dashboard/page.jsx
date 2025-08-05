"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [dashboardData] = useState({
    totalApar: 125,
    normalApar: 100,
    needsAttentionApar: 15,
    expiredSoonApar: 10,
    locationsByBuilding: {
      "Gedung F": [
        "Lantai 1 F",
        "Lantai 2 F",
        "Ruang Server F",
        "Pos Keamanan F",
      ],
      "Gedung G": [
        "Lantai 1 G",
        "Lantai 2 G",
        "Dapur Utama G",
        "Gudang Utama G",
      ],
      "Gedung H": [
        "Lantai 1 H",
        "Lantai 2 H",
        "Area Produksi H",
        "Ruang Kontrol H",
      ],
    },
    allInspections: [
      {
        id: 1,
        aparId: "APAR-001",
        location: "Lantai 1 F",
        status: "Normal",
        date: "2025-07-20",
      },
      {
        id: 2,
        aparId: "APAR-005",
        location: "Ruang Server F",
        status: "Perlu Isi Ulang",
        date: "2025-07-19",
      },
      {
        id: 3,
        aparId: "APAR-012",
        location: "Dapur Utama G",
        status: "Normal",
        date: "2025-07-18",
      },
      {
        id: 4,
        aparId: "APAR-020",
        location: "Lantai 2 H",
        status: "Expired",
        date: "2025-07-17",
      },
      {
        id: 5,
        aparId: "APAR-002",
        location: "Lantai 1 F",
        status: "Normal",
        date: "2025-07-16",
      },
      {
        id: 6,
        aparId: "APAR-015",
        location: "Gudang Utama G",
        status: "Normal",
        date: "2025-07-15",
      },
      {
        id: 7,
        aparId: "APAR-008",
        location: "Ruang Kontrol H",
        status: "Perlu Perbaikan",
        date: "2025-07-14",
      },
      {
        id: 8,
        aparId: "APAR-025",
        location: "Pos Keamanan F",
        status: "Normal",
        date: "2025-07-13",
      },
      {
        id: 9,
        aparId: "APAR-030",
        location: "Lantai 1 G",
        status: "Normal",
        date: "2025-07-12",
      },
      {
        id: 10,
        aparId: "APAR-010",
        location: "Area Produksi H",
        status: "Expired",
        date: "2025-07-11",
      },
    ],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownTambah, setOpenDropdownTambah] = useState(false);
  const [openDropdownDaftar, setOpenDropdownDaftar] = useState(false);

  const dropdownTambahRef = useRef(null);
  const dropdownDaftarRef = useRef(null);

  // Fungsi untuk menutup dropdown saat klik di luar area dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownTambahRef.current &&
        !dropdownTambahRef.current.contains(event.target)
      ) {
        setOpenDropdownTambah(false);
      }
      if (
        dropdownDaftarRef.current &&
        !dropdownDaftarRef.current.contains(event.target)
      ) {
        setOpenDropdownDaftar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredInspections = useMemo(() => {
    return dashboardData.allInspections.filter(
      (inspection) =>
        inspection.aparId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dashboardData.allInspections]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header/Navbar Dashboard */}
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 border border-gray-200">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
            Dashboard Monitoring APAR
          </h1>
        </div>
        <nav className="w-full sm:w-auto">
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <li className="relative" ref={dropdownTambahRef}>
              <button
                onClick={() => {
                  setOpenDropdownTambah(!openDropdownTambah);
                  setOpenDropdownDaftar(false);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full sm:w-auto"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Tambah
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown "Tambah" dengan lebar responsif */}
              <ul
                className={`absolute left-0 mt-2 w-full sm:w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden
                             transform transition-all duration-200 ease-out
                             ${
                               openDropdownTambah
                                 ? "scale-100 opacity-100 visible"
                                 : "scale-95 opacity-0 invisible"
                             }`}
              >
                <li>
                  <Link
                    href="/apar/register"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                  >
                    Tambah APAR
                  </Link>
                </li>
                <li>
                  <Link
                    href="/user/addUser"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                  >
                    Tambah User
                  </Link>
                </li>
              </ul>
            </li>

            <li className="relative" ref={dropdownDaftarRef}>
              <button
                onClick={() => {
                  setOpenDropdownDaftar(!openDropdownDaftar);
                  setOpenDropdownTambah(false);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-sm font-semibold rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full sm:w-auto"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Daftar
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown "Daftar" dengan lebar responsif */}
              <ul
                className={`absolute left-0 mt-2 w-full sm:w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden
                             transform transition-all duration-200 ease-out
                             ${
                               openDropdownDaftar
                                 ? "scale-100 opacity-100 visible"
                                 : "scale-95 opacity-0 invisible"
                             }`}
              >
                <li>
                  <Link
                    href="/apar/register/listApar"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                  >
                    Daftar APAR
                  </Link>
                </li>
                <li>
                  <Link
                    href="/user/listUser"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                  >
                    Daftar User
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                href="/logout"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-red-600 bg-white hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out w-full sm:w-auto"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1"
                  ></path>
                </svg>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Bagian Ringkasan Statistik */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between transition duration-200 ease-in-out hover:shadow-lg">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total APAR</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {dashboardData.totalApar}
            </h3>
          </div>
          <svg
            className="w-12 h-12 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between transition duration-200 ease-in-out hover:shadow-lg">
          <div>
            <p className="text-gray-500 text-sm font-medium">APAR Normal</p>
            <h3 className="text-3xl font-bold text-green-600">
              {dashboardData.normalApar}
            </h3>
          </div>
          <svg
            className="w-12 h-12 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between transition duration-200 ease-in-out hover:shadow-lg">
          <div>
            <p className="text-gray-500 text-sm font-medium">Perlu Perhatian</p>
            <h3 className="text-3xl font-bold text-red-600">
              {dashboardData.needsAttentionApar}
            </h3>
          </div>
          <svg
            className="w-12 h-12 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between transition duration-200 ease-in-out hover:shadow-lg">
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Kadaluarsa/Segera
            </p>
            <h3 className="text-3xl font-bold text-yellow-600">
              {dashboardData.expiredSoonApar}
            </h3>
          </div>
          <svg
            className="w-12 h-12 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
      </section>

      {/* Bagian Lokasi APAR Terdaftar */}
      <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Lokasi APAR Terdaftar
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gedung
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lokasi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(dashboardData.locationsByBuilding).map(
                ([buildingName, locations]) =>
                  locations.map((location, locIndex) => (
                    <tr key={`${buildingName}-${locIndex}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {buildingName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {location}
                      </td>
                    </tr>
                  ))
              )}
              {Object.keys(dashboardData.locationsByBuilding).length === 0 && (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Belum ada lokasi APAR yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/apar/locations"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Lihat Denah Gedung & Lokasi APAR
            <svg
              className="ml-2 -mr-0.5 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </Link>
        </div>
      </section>

      {/* Bagian Riwayat Inspeksi Terbaru (dengan Search Bar/Filter) */}
      <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Riwayat Inspeksi Terbaru
        </h3>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari berdasarkan ID APAR, Lokasi, atau Status..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID APAR
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lokasi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal Inspeksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInspections.length > 0 ? (
                filteredInspections.map((inspection) => (
                  <tr key={inspection.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inspection.aparId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {inspection.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inspection.status === "Normal"
                            ? "bg-green-100 text-green-800"
                            : inspection.status === "Perlu Isi Ulang"
                            ? "bg-yellow-100 text-yellow-800"
                            : inspection.status === "Perlu Perbaikan"
                            ? "bg-orange-100 text-orange-800"
                            : inspection.status === "Expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {inspection.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data inspeksi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/apar/inspections"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Lihat Semua Riwayat Inspeksi &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
