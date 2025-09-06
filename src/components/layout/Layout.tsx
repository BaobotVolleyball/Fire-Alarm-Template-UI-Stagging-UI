import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ToastContainer } from '@/components/ui/toast'
import { ModalContainer } from '@/components/ui/modal'
import { useAppDispatch } from '@/store'
import { initializeUI } from '@/store/slices/uiSlice'
import { initializeAuth } from '@/store/slices/authSlice'

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const dispatch = useAppDispatch()

  // Initialize app state
  useEffect(() => {
    dispatch(initializeUI())
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar với animation */}
      <AnimatePresence mode="wait">
        {!sidebarHidden && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="relative z-30"
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              onHide={() => setSidebarHidden(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content với responsive margin */}
      <motion.div
        className="flex flex-1 flex-col overflow-hidden"
        animate={{
          marginLeft: sidebarHidden ? 0 : sidebarCollapsed ? 80 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Header với navigation integration */}
        <Header
          sidebarHidden={sidebarHidden}
          onShowSidebar={() => setSidebarHidden(false)}
        />

        {/* Page Content với smooth transitions */}
        <motion.main
          className="flex-1 overflow-auto bg-slate-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Outlet />
        </motion.main>
      </motion.div>

      {/* Overlay cho mobile */}
      <AnimatePresence>
        {!sidebarHidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarHidden(true)}
          />
        )}
      </AnimatePresence>

      {/* Global UI Components */}
      <ToastContainer />
      <ModalContainer />
    </div>
  )
}
