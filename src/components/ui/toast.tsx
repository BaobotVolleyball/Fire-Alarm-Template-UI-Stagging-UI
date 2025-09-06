import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { removeToast } from '@/store/slices/uiSlice'

// === Toast Notification System ===

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration: number
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(id))
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, dispatch])

  const handleClose = () => {
    dispatch(removeToast(id))
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getStyles()}`}
    >
      {getIcon()}
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={handleClose}
        className="p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector(state => state.ui.toasts)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for easy toast usage
export const useToast = () => {
  const dispatch = useAppDispatch()

  const toast = {
    success: (message: string, duration = 4000) => {
      dispatch({
        type: 'ui/addToast',
        payload: { type: 'success', message, duration }
      })
    },
    error: (message: string, duration = 6000) => {
      dispatch({
        type: 'ui/addToast',
        payload: { type: 'error', message, duration }
      })
    },
    warning: (message: string, duration = 5000) => {
      dispatch({
        type: 'ui/addToast',
        payload: { type: 'warning', message, duration }
      })
    },
    info: (message: string, duration = 4000) => {
      dispatch({
        type: 'ui/addToast',
        payload: { type: 'info', message, duration }
      })
    }
  }

  return toast
}
