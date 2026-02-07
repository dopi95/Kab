'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from '@/components/UserSidebar';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          if (data.user.role !== 'user') {
            router.push('/admin');
            return;
          }
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          router.push('/signin');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/signin');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#171817]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A97E50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#171817]">
      <UserSidebar user={user} />
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
