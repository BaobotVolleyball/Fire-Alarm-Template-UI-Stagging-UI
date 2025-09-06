import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  User,
  Settings,
  LogOut,
  Building2,
  Menu,
  Search,
  Zap,
  Shield,
  AlertTriangle,
  Activity,
  ChevronDown,
  Globe,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  sidebarHidden?: boolean
  onShowSidebar?: () => void
}

// Tab menu cho các trang chính
const tabMenus: Record<string, Array<{ name: string; href: string; icon: any }>> = {
  '/thiet-bi': [
    { name: 'Dashboard Tenant', href: '/thiet-bi/tenant', icon: Building2 },
    { name: 'Dashboard Department', href: '/thiet-bi/department', icon: Shield },
    { name: 'Console Plane', href: '/thiet-bi/console', icon: Activity }
  ],
  '/ung-cuu-su-co': [
    { name: 'Tổng quan', href: '/ung-cuu-su-co', icon: AlertTriangle },
    { name: 'Bản đồ', href: '/ung-cuu-su-co/map', icon: Globe },
    { name: 'Timeline', href: '/ung-cuu-su-co/timeline', icon: Clock }
  ]
}

export function Header({ sidebarHidden = false, onShowSidebar }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const location = useLocation()

  // Lấy tab menu cho trang hiện tại
  const currentTabs = Object.keys(tabMenus).find(path =>
    location.pathname.startsWith(path)
  )
  const tabs = currentTabs ? tabMenus[currentTabs] : []

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Mobile menu + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <AnimatePresence>
            {sidebarHidden && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onShowSidebar}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Breadcrumb với animation */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Building2 className="h-5 w-5 text-slate-500" />
            <span className="text-sm text-slate-600">Chi nhánh A</span>
            <span className="text-slate-400">/</span>
            <span className="text-sm font-medium text-slate-900">Tổng quan Hệ thống</span>
          </motion.div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <motion.button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5 text-slate-600" />
            </motion.button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4"
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm sự cố, thiết bị, tài liệu..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Emergency Status với animation */}
          <motion.div
            className="hidden md:flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-emerald-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-xs font-medium text-emerald-700">Bình thường</span>
          </motion.div>

          {/* Notifications với dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <motion.span
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                3
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {notificationOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4"
                >
                  <h3 className="font-semibold text-slate-900 mb-3">Thông báo mới</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm font-medium text-red-900">Sự cố cháy - Chi nhánh A</div>
                      <div className="text-xs text-red-700">2 phút trước</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="text-sm font-medium text-amber-900">Thiết bị UPS offline</div>
                      <div className="text-xs text-amber-700">5 phút trước</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <motion.button
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="h-5 w-5 text-slate-600" />
          </motion.button>

          {/* User Menu */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-slate-900">Admin Tenant</div>
              <div className="text-xs text-slate-500">admin@viotech.com</div>
            </div>
            <motion.button
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="h-5 w-5 text-slate-600" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tab Menu cho các trang có sub-navigation */}
      <AnimatePresence>
        {tabs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-slate-200 bg-white"
          >
            <div className="flex items-center gap-1 px-6 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = location.pathname === tab.href
                return (
                  <motion.a
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
