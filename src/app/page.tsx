'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function Home() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false);
  const { authenticate, isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated === true && !hasAttemptedRedirect) {
      setHasAttemptedRedirect(true);
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, hasAttemptedRedirect]);
  
  if (isAuthenticated === null || (isAuthenticated === true && !hasAttemptedRedirect)) {
    return null;
  }
  
  if (isAuthenticated === true && hasAttemptedRedirect) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const isValid = authenticate(passcode);
    
    if (isValid) {
      // router.push('/dashboard'); 
      // No direct push here, the state change will trigger the useEffect
    } else {
      setError('Invalid passcode. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">AI Image Forge</h1>
          <p className="text-center text-gray-600 dark:text-gray-300">Enter passcode to access image generation</p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Passcode
            </label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter passcode"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
      
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p> 2025 AI Image Forge • A private image generation platform</p>
      </footer>
    </div>
  );
}
