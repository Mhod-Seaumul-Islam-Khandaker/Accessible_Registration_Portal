// signup/page.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  student_id: string;
  employee_id: string;
}

interface Message {
  type: 'error' | 'success' | '';
  text: string;
}

const SignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    student_id: '',
    employee_id: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'role') {
      setFormData(prev => ({
        ...prev,
        student_id: '',
        employee_id: ''
      }));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.full_name.trim()) return 'Full name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email';
    
    if (formData.phone && !/^\d{11}$/.test(formData.phone)) {
      return 'Phone must be 11 digits';
    }
    
    if (formData.role === 'student' && !formData.student_id) {
      return 'Student ID is required';
    }
    if ((formData.role === 'teacher' || formData.role === 'admin') && !formData.employee_id) {
      return 'Employee ID is required';
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        role: formData.role,
        student_id: formData.role === 'student' ? formData.student_id : null,
        employee_id: (formData.role === 'teacher' || formData.role === 'admin') ? formData.employee_id : null
      };

      const { data, error: supabaseError } = await supabase
        .from('user_account')
        .insert([userData])
        .select();

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          if (supabaseError.message.includes('email')) {
            throw new Error('Email already exists');
          } else if (supabaseError.message.includes('student_id')) {
            throw new Error('Student ID already exists');
          } else if (supabaseError.message.includes('employee_id')) {
            throw new Error('Employee ID already exists');
          }
        }
        throw supabaseError;
      }

      setMessage({ 
        type: 'success', 
        text: 'Signup successful! You can now log in.' 
      });
      
      // Reset form on success
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
        student_id: '',
        employee_id: ''
      });

    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Signup failed. Please try again.' 
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
          Full Name *
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="John Doe"
          required
        />
      </div>

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
          Phone (Optional)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="12345678901"
          maxLength={11}
        />
        <p className="text-xs text-gray-400 mt-1">11 digits without spaces</p>
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

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Role *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {formData.role === 'student' && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Student ID *
          </label>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="STU001"
            required
          />
        </div>
      )}

      {(formData.role === 'teacher' || formData.role === 'admin') && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Employee ID *
          </label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="EMP001"
            required
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        * Required fields
        <br />
        <span className="text-yellow-500">
          Note: Passwords are stored in plain text for learning only.
        </span>
      </p>
    </form>
  );
};

export default SignupForm;