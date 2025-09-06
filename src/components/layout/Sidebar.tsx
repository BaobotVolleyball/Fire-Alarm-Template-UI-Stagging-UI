import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid,
  Flame,
  Wrench,
  BarChart3,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Zap,
  Shield,
  Camera,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Cấu trúc menu theo nhóm chức năng
const navigationGroups = [
  {
    title: 'TÁC CHIẾN ỨNG CỨU',
    items: [
      {
        name: 'Ứng cứu Sự cố',
        href: '/ung-cuu-su-co',
        icon: Flame,
        description: 'Điều phối sự cố Cháy, An ninh, SOS',
        badge: 'LIVE',
        badgeColor: 'bg-red-500'
      },
      {
        name: 'Ứng cứu Kỹ thuật',
        href: '/ung-cuu-ky-thuat',
        icon: Wrench,
        description: 'Xử lý sự cố kỹ thuật thiết bị',
        badge: '3',
        badgeColor: 'bg-amber-500'
      },
      {
        name: 'Chi tiết Sự cố',
        href: '/chi-tiet-su-co',
        icon: AlertTriangle,
        description: 'Xem chi tiết sự cố cụ thể'
      }
    ]
  },
  {
    title: 'TÀI SẢN THIẾT BỊ',
    items: [
      {
        name: 'Quản lý Hệ thống',
        href: '/thiet-bi',
        icon: LayoutGrid,
        description: 'Dashboard & Tổng quan thiết bị',
        subItems: [
          { name: 'Dashboard Tenant', href: '/thiet-bi/tenant' },
          { name: 'Dashboard Department', href: '/thiet-bi/department' },
          { name: 'Console Plane', href: '/thiet-bi/console' }
        ]
      },
      {
        name: 'Camera & Giám sát',
        href: '/camera',
        icon: Camera,
        description: 'Hệ thống camera RTSP/ONVIF'
      }
    ]
  },
  {
    title: 'HỒ SƠ PHÁP LÝ',
    items: [
      {
        name: 'Thống kê & Báo cáo',
        href: '/thong-ke-su-co',
        icon: BarChart3,
        description: 'Báo cáo tuân thủ ND105/2025'
      }
    ]
  },
  {
    title: 'TÀI KHOẢN',
    items: [
      {
        name: 'Quản lý Người dùng',
        href: '/users',
        icon: Users,
        description: 'RBAC & Phân quyền'
      },
      {
        name: 'Cài đặt Hệ thống',
        href: '/settings',
        icon: Settings,
        description: 'Cấu hình & Tùy chỉnh'
      }
    ]
  }
]

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
  onHide?: () => void
}

export function Sidebar({ className, collapsed = false, onToggleCollapse, onHide }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['TÁC CHIẾN ỨNG CỨU', 'TÀI SẢN THIẾT BỊ'])
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const location = useLocation()

  const toggleGroup = (groupTitle: string) => {
    if (collapsed) return
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    )
  }

  const toggleSubItems = (itemName: string) => {
    if (collapsed) return
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(i => i !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <motion.div
      className={cn(
        "flex h-full flex-col bg-white border-r border-slate-200 shadow-lg",
        collapsed ? "w-20" : "w-80",
        className
      )}
      animate={{ width: collapsed ? 80 : 320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Logo & Brand với animation */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 relative">
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-red-600 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShieldCheck className="h-7 w-7 text-white" />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-lg font-bold text-slate-900">Fire Alarm System</h1>
              <p className="text-xs text-slate-500">Viotech - ND105/2025</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control buttons */}
        <div className="absolute right-2 top-4 flex gap-1">
          <motion.button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            )}
          </motion.button>

          <motion.button
            onClick={onHide}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4 text-slate-500" />
          </motion.button>
        </div>
      </div>

      {/* Navigation với nhóm và animation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            {/* Group Header */}
            <AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  <span>{group.title}</span>
                  <motion.div
                    animate={{ rotate: expandedGroups.includes(group.title) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Group Items */}
            <AnimatePresence>
              {(collapsed || expandedGroups.includes(group.title)) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href ||
                                   (item.subItems && item.subItems.some(sub => location.pathname === sub.href))
                    const hasSubItems = item.subItems && item.subItems.length > 0
                    const isExpanded = expandedItems.includes(item.name)

                    return (
                      <div key={item.name}>
                        {/* Main Item */}
                        <motion.div
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <NavLink
                            to={item.href}
                            onClick={(e) => {
                              if (hasSubItems) {
                                e.preventDefault()
                                toggleSubItems(item.name)
                              }
                            }}
                            className={cn(
                              "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative",
                              isActive
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 transition-colors flex-shrink-0",
                                isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                              )}
                            />

                            <AnimatePresence>
                              {!collapsed && (
                                <motion.div
                                  className="flex-1 min-w-0"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="font-semibold truncate">{item.name}</div>
                                  <div className="text-xs text-slate-500 group-hover:text-slate-600 truncate">
                                    {item.description}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Badge */}
                            {item.badge && !collapsed && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                  "px-2 py-0.5 text-xs font-bold text-white rounded-full",
                                  item.badgeColor || "bg-blue-500"
                                )}
                              >
                                {item.badge}
                              </motion.span>
                            )}

                            {/* Expand indicator */}
                            {hasSubItems && !collapsed && (
                              <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                              </motion.div>
                            )}
                          </NavLink>
                        </motion.div>

                        {/* Sub Items */}
                        <AnimatePresence>
                          {hasSubItems && isExpanded && !collapsed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="ml-8 mt-1 space-y-1"
                            >
                              {item.subItems!.map((subItem) => (
                                <NavLink
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={({ isActive }) =>
                                    cn(
                                      "block px-3 py-2 text-sm rounded-lg transition-colors",
                                      isActive
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )
                                  }
                                >
                                  {subItem.name}
                                </NavLink>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Status Footer với animation */}
      <motion.div
        className="border-t border-slate-200 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Activity className="h-4 w-4 text-emerald-500" />
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1"
              >
                <div className="text-xs text-slate-500">
                  Hệ thống hoạt động bình thường
                </div>
                <div className="text-xs text-slate-400">
                  Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Stats cho collapsed mode */}
        <AnimatePresence>
          {collapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-2 space-y-1"
            >
              <div className="w-full h-1 bg-emerald-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="text-center text-xs text-emerald-600 font-medium">85%</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
