"use client";

import { useState, useEffect } from "react";

const ConfirmationModal = ({ isOpen, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-11/12 max-w-sm">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ isOpen, user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: user ? user.id : null,
    username: user ? user.username : "",
    password: "",
    role: user ? user.role : "inspektur",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        password: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-11/12 max-w-sm">
        <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Edit Pengguna</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password (kosongkan jika tidak ingin mengubah)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              required
            >
              <option value="admin">Admin</option>
              <option value="inspektur">Inspektur</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const dummyUsers = [
  { id: 1, username: "admin1", role: "admin", password: "password123" },
  { id: 2, username: "inspektur1", role: "inspektur", password: "password456" },
  { id: 3, username: "admin2", role: "admin", password: "password789" },
  { id: 4, username: "inspektur2", role: "inspektur", password: "passwordabc" },
  { id: 5, username: "user_biasa", role: "guest", password: "passwordxyz" },
];

export default function ListUserPage() {
  const [users, setUsers] = useState(dummyUsers);
  const [filterRole, setFilterRole] = useState("all");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

  const filteredUsers =
    filterRole === "all"
      ? users
      : users.filter((user) => user.role === filterRole);

  const handleDeleteClick = (id) => {
    setUserToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDeleteId !== null) {
      setUsers(users.filter((user) => user.id !== userToDeleteId));
      setIsConfirmModalOpen(false);
      setUserToDeleteId(null);
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setUserToDeleteId(null);
  };

  const handleEditClick = (user) => {
    setCurrentUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map((user) =>
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    ));
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentUserToEdit(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-200 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengguna Sistem</h1>

        <div className="flex items-center gap-2">
          <label htmlFor="filterRole" className="text-sm text-gray-700 font-medium">Filter Role:</label>
          <select
            id="filterRole"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua</option>
            <option value="admin">Admin</option>
            <option value="inspektur">Inspektur</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold uppercase tracking-wider">No</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold uppercase tracking-wider">Username</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold uppercase tracking-wider">Role</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.username}</td>
                  <td className="px-4 py-2 whitespace-nowrap capitalize">{user.role}</td>
                  <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="text-red-600 hover:underline hover:text-red-800 transition-colors duration-200"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-500"
                >
                  Tidak ada user ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message="Yakin ingin menghapus user ini? Aksi ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onClose={closeConfirmModal}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        user={currentUserToEdit}
        onSave={handleSaveUser}
        onClose={closeEditModal}
      />
    </div>
  );
}