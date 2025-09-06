import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { closeModal } from '@/store/slices/uiSlice'

// === Modal System ===

interface ModalProps {
  id: string
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  onClose?: () => void
}

const Modal: React.FC<ModalProps> = ({ id, title, children, size = 'md', onClose }) => {
  const dispatch = useAppDispatch()

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    dispatch(closeModal(id))
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md'
      case 'md':
        return 'max-w-lg'
      case 'lg':
        return 'max-w-2xl'
      case 'xl':
        return 'max-w-4xl'
      case 'full':
        return 'max-w-7xl mx-4'
      default:
        return 'max-w-lg'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative bg-white rounded-xl shadow-2xl w-full ${getSizeClasses()}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={title ? 'p-6' : 'p-6'}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

export const ModalContainer: React.FC = () => {
  const modals = useAppSelector(state => state.ui.modals)

  return (
    <AnimatePresence>
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          id={modal.id}
          title={modal.props?.title}
          size={modal.props?.size}
          onClose={modal.props?.onClose}
        >
          {modal.props?.children}
        </Modal>
      ))}
    </AnimatePresence>
  )
}

// Hook for easy modal usage
export const useModal = () => {
  const dispatch = useAppDispatch()

  const modal = {
    open: (type: string, props?: Record<string, any>) => {
      dispatch({
        type: 'ui/openModal',
        payload: { type, props }
      })
    },
    close: (id: string) => {
      dispatch(closeModal(id))
    },
    closeAll: () => {
      dispatch({ type: 'ui/closeAllModals' })
    }
  }

  return modal
}

// Pre-built modal components
export const ConfirmModal: React.FC<{
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy',
  type = 'info'
}) => {
  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white'
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyles()}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  )
}

export const LoadingModal: React.FC<{
  message?: string
}> = ({ message = 'Đang xử lý...' }) => {
  return (
    <div className="flex items-center gap-3 py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-slate-700">{message}</span>
    </div>
  )
}
