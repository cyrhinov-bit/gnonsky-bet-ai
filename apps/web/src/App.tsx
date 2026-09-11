import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayComboPage } from './pages/TodayComboPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('gnonsky_auth_token') === 'AUTH_VALID_MAJORIX90' ||
        localStorage.getItem('gnonsky_logged_in') === 'true' ||
        localStorage.getItem('betpulse_auth_token') === 'AUTH_VALID_MAJORIX90'
      );
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = () => {
    try {
      localStorage.setItem('gnonsky_auth_token', 'AUTH_VALID_MAJORIX90');
      localStorage.setItem('gnonsky_logged_in', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('gnonsky_auth_token');
      localStorage.removeItem('gnonsky_logged_in');
      localStorage.removeItem('betpulse_auth_token');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Header onLogout={handleLogout} />
        <main className="flex-1 w-full max-w-lg mx-auto pt-20 pb-20 px-4">
          <Routes>
            <Route path="/" element={<TodayComboPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};
