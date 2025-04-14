import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'reader',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/register', form);
      navigate('/login');
    } catch (err) {
      setError('Registrasi gagal. Periksa kembali data Anda.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Buat Akun Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nama"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.role}
            onChange={handleChange}
          >
            <option value="reader">Daftar sebagai Pembaca</option>
            <option value="author">Daftar sebagai Penulis</option>
          </select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Daftar
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
