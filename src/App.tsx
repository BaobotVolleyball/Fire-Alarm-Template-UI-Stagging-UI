import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import DeviceManagement from '@/pages/DeviceManagement'
import IncidentResponse from '@/pages/IncidentResponse'
import { IncidentDetail } from '@/pages/IncidentDetail'
import { IncidentStatistics } from '@/pages/IncidentStatistics'
import { TechnicalResponse } from '@/pages/TechnicalResponse'

function App() {
  return (
    <Routes>
      {/* Main Layout với Sidebar */}
      <Route path="/" element={<Layout />}>
        {/* Redirect root to device management */}
        <Route index element={<Navigate to="/thiet-bi" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Quản lý Thiết bị với sub-routes */}
        <Route
          path="thiet-bi/*"
          element={<DeviceManagement />}
        />
        
        {/* Ứng cứu Sự cố */}
        <Route
          path="ung-cuu-su-co"
          element={<IncidentResponse />}
        />
        
        {/* Ứng cứu Kỹ thuật */}
        <Route
          path="ung-cuu-ky-thuat"
          element={<TechnicalResponse />}
        />

        {/* Thống kê Sự cố */}
        <Route
          path="thong-ke-su-co"
          element={<IncidentStatistics />}
        />

        {/* Chi tiết Sự cố */}
        <Route
          path="chi-tiet-su-co"
          element={<IncidentDetail />}
        />
        
        {/* 404 Page */}
        <Route 
          path="*" 
          element={
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
                <p className="text-slate-600">Trang không tìm thấy</p>
              </div>
            </div>
          } 
        />
      </Route>
    </Routes>
  )
}

export default App
