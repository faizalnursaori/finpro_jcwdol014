import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (storedUserId && token) {
      setUserId(storedUserId);
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUserId(null);
    router.push('/login');
  };

  return { userId, isLoading, logout };
};
