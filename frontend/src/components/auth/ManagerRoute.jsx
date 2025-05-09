import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ManagerRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // Nếu đang loading, hiển thị loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Nếu không xác thực hoặc không phải Manager, chuyển hướng đến trang chủ
  if (!isAuthenticated || user?.role !== 'manager') {
    return <Navigate to="/" />;
  }

  // Nếu là Manager, hiển thị children components
  return <Outlet />;
};

export default ManagerRoute; 