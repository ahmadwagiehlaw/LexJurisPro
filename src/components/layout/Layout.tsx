import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LegalAssistant } from '../ai/LegalAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
      <LegalAssistant />
    </div>
  );
}
