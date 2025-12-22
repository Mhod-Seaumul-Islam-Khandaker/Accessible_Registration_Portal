// login/page.tsx
'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface LoginFormData {
  email: string;
  password: string;
}

interface Message {
  type: 'error' | 'success' | '';
  text: string;
}

interface UserAccount {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  student_id: string | null;
  employee_id: string | null;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim() || !formData.password) {
      setMessage({ type: 'error', text: 'Email and password are required' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Query the database for user with matching email and password
      const { data: users, error } = await supabase
        .from('user_account')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password) // Direct comparison (plain text)
        .eq('status', 'active') // Only allow active users
        .single();

      if (error) {
        // If no user found or single() fails (no rows)
        throw new Error('Invalid email or password');
      }

      if (!users) {
        throw new Error('Invalid email or password');
      }

      const user = users as UserAccount;
      
      // Login successful
      setMessage({ 
        type: 'success', 
        text: `Login successful! Welcome back, ${user.full_name}. Role: ${user.role}` 
      });
      
      // Store user data in localStorage or state management
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        student_id: user.student_id,
        employee_id: user.employee_id
      }));
      
      // Reset form
      setFormData({ email: '', password: '' });
      
      // Redirect or update app state here
      // Example: window.location.href = '/dashboard';
      
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Login failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-900/50 border border-red-700 text-red-200' : 'bg-green-900/50 border border-green-700 text-green-200'}`}>
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
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="john@example.com"
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
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          Demo login info will be shown here
          <br />
          <span className="text-yellow-500 text-xs">
            (You'll add test user data after signup)
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;