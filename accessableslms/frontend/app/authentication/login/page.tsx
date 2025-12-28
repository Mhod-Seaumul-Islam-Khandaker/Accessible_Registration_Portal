// app/login/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Supabase } from '../../lib/supabase-client';
import type { LoginFormData, Message, UserAccount } from '../../types/form';

const LoginForm = () => {
  const router = useRouter(); // ✅ Hooks must be at top level

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: '',
    text: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setMessage({
        type: 'error',
        text: 'Email and password are required',
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data, error } = await Supabase
        .from('user_account')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password) // ⚠️ Plain-text (see note below)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        throw new Error('Invalid email or password');
      }

      const user = data as UserAccount;

      // Store user in cookie (encoded)
      document.cookie =
        `user=${encodeURIComponent(
          JSON.stringify({
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.role,
            student_id: user.student_id,
            employee_id: user.employee_id,
          })
        )}; path=/`;

      setMessage({
        type: 'success',
        text: `Login successful! Welcome back, ${user.full_name}.`,
      });

      setFormData({ email: '', password: '' });

      // Redirect based on role (optional but recommended)
      router.push(`/${user.role}`);

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'error'
              ? 'bg-red-900/50 border border-red-700 text-red-200'
              : 'bg-green-900/50 border border-green-700 text-green-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Password *
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2.5 rounded-md"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
