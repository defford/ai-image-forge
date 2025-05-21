'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import Logo from '@/components/Logo';
import { FiLogOut } from 'react-icons/fi';

// Dynamically import components to avoid any potential circular dependencies
const PromptForm = dynamic(() => import('@/components/PromptForm'), { ssr: false });
const ImageGallery = dynamic(() => import('@/components/ImageGallery'), { ssr: false });

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If auth state is resolved and user is not authenticated, redirect to home.
    if (isAuthenticated === false) {
      const timerId = setTimeout(() => {
        router.push('/');
      }, 0);
      return () => clearTimeout(timerId); // Cleanup timeout
    }
  }, [isAuthenticated, router]); // Rerun effect if isAuthenticated or router changes

  // Handle loading state: if isAuthenticated is null, auth is still being checked.
  if (isAuthenticated === null) {
    return null; // Or return a loading spinner/component
  }

  // If not authenticated (and no longer loading), render nothing.
  // The useEffect above will handle the redirection.
  if (isAuthenticated === false) {
    return null;
  }

  // If authenticated, render the dashboard content.
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Image Forge</h1>
          </div>
          <HeaderActions />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <PromptForm />
          </div>
          <div className="lg:col-span-8">
            <ImageGallery />
          </div>
        </div>
      </main>
    </div>
  );
}

function HeaderActions() {
  const { logout } = useAuth();
  
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={logout} // AuthContext.logout() only sets state, no navigation
        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white rounded-md transition-colors"
      >
        <FiLogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}
