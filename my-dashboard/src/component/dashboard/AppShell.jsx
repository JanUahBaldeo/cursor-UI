import React from 'react';
import Header from '../Header';

export default function AppShell({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white/60 to-gray-100/80 dark:from-gray-900/60 dark:to-gray-800/80">
      <Header />
      <main className="flex-1 overflow-y-auto mt-24">
          {children}
        </main>
    </div>
  );
} 