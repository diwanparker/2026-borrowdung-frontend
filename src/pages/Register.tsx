import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5240/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registrasi gagal');
      }

      alert('Registrasi berhasil! Silakan login dengan akun Anda.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat registrasi');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-8">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Daftar Akun</h1>
          <p className="text-gray-600 mt-2">Buat akun baru untuk peminjaman ruangan</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Masukkan nama lengkap"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Masukkan username"
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Masukkan email"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Minimal 6 karakter"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Konfirmasi Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ulangi password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
