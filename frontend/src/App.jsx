import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';

// Auth components
import PrivateRoute from './components/auth/PrivateRoute';
import ManagerRoute from './components/auth/ManagerRoute';

// layouts
import Admin from "@/views/Admin";
import Auth from "@/views/Auth";
import AuthCover from "@/views/AuthCover";
import AuthIlustration from "@/views/AuthIlustration";
import Landing from "@/views/Landing";
import Maintenance from "@/views/Maintenance";
import AdminCompact from '@/views/AdminCompact';
import Sidedark from '@/views/Sidedark';

// Socket service
import { MessageService } from './services';

export default function App() {
  // Kết nối socket khi component mount
  useEffect(() => {
    const socket = MessageService.connectSocket();
    
    // Ngắt kết nối socket khi unmount
    return () => {
      MessageService.disconnectSocket();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/auth2/*" element={<AuthCover />} />
        <Route path="/auth3/*" element={<AuthIlustration />} />
        <Route path="/landing-page/*" element={<Landing />} />
        <Route path="/maintenance/*" element={<Maintenance />} />

        {/* Protected routes - Require authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/*" element={<Admin />} />
          <Route path="/compact/*" element={<AdminCompact />} />
          <Route path="/side-dark/*" element={<Sidedark />} />
          
          {/* Manager-only routes */}
          <Route element={<ManagerRoute />}>
            {/* Các routes chỉ dành cho manager sẽ được thêm vào đây */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}