import React, { createContext, useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

import * as Tooltip from '@radix-ui/react-tooltip';

import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AppShell from './component/dashboard/AppShell';
import { UserProvider } from './context/UserContext';

import './index.css';

// Modal Context for global modals
const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

function ModalPortal({ children }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {children}
    </div>
  );
}

function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  const showModal = (content) => setModal(content);
  const hideModal = () => setModal(null);
  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modal && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-auto" onClick={hideModal}>
            <div className="relative bg-white text-gray-800 w-full max-w-lg sm:max-w-xl md:max-w-2xl p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-teal-500" onClick={e => e.stopPropagation()}>
              <button onClick={hideModal} className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-xl">×</button>
              {modal}
            </div>
          </div>
        </ModalPortal>
      )}
    </ModalContext.Provider>
  );
}

// 🔒 Route Guard
const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminDashboardPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
    The admin dashboard has been modularized. Please use the main dashboard sections for admin features.
  </div>
);

const App = () => {
  // Remove useUser here, use context inside children
  return (
    <UserProvider>
      <ModalProvider>
        <div className="min-h-screen w-full font-sans animate-fade-in bg-gray-50 text-black">
          <Tooltip.Provider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Protected Routes inside AppShell */}
              <Route
                path="/*"
                element={
                  <AppShell>
                    <Routes>
                      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                      <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                      <Route path="/user-dashboard/:userId" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
                      <Route path="/admin-dashboard/:userId" element={<ProtectedRoute><AdminDashboardPlaceholder /></ProtectedRoute>} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppShell>
                }
              />
              {/* Unauthorized outside shell */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
          </Tooltip.Provider>
        </div>
      </ModalProvider>
    </UserProvider>
  );
};

export default App;
