// app/hooks/useAuth.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '../types/auth';

export function useAuth(requiredRole?: UserRole) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(cookie =>
        cookie.trim().startsWith('user=')
      );

      if (!userCookie) {
        router.push('/authentication/login');
        return;
      }

      const cookieValue = userCookie.split('=')[1];
      const userData: User = JSON.parse(decodeURIComponent(cookieValue));

      if (requiredRole && userData.role !== requiredRole) {
        router.push('/authentication/login');
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      router.push('/authentication/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    document.cookie =
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/authentication/login');
  };

  return { user, loading, logout };
}
