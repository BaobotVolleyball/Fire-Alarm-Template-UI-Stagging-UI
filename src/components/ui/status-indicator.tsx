import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, AlertTriangle, Activity, Zap } from 'lucide-react'

// === Real-time Status Indicators ===

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'connecting'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  animated?: boolean
  className?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showText = false,
  animated = true,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2'
      case 'md':
        return 'w-3 h-3'
      case 'lg':
        return 'w-4 h-4'
      default:
        return 'w-3 h-3'
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-emerald-500',
          text: 'Online',
          textColor: 'text-emerald-700'
        }
      case 'offline':
        return {
          color: 'bg-slate-400',
          text: 'Offline',
          textColor: 'text-slate-700'
        }
      case 'warning':
        return {
          color: 'bg-amber-500',
          text: 'Warning',
          textColor: 'text-amber-700'
        }
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Error',
          textColor: 'text-red-700'
        }
      case 'connecting':
        return {
          color: 'bg-blue-500',
          text: 'Connecting',
          textColor: 'text-blue-700'
        }
      default:
        return {
          color: 'bg-slate-400',
          text: 'Unknown',
          textColor: 'text-slate-700'
        }
    }
  }

  const config = getStatusConfig()

  const pulseAnimation = animated && (status === 'online' || status === 'connecting') ? {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7]
  } : {}

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className={`rounded-full ${config.color} ${getSizeClasses()}`}
        animate={pulseAnimation}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {showText && (
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.text}
        </span>
      )}
    </div>
  )
}

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'reconnecting'
  className?: string
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  className = ''
}) => {
  const getIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-emerald-600" />
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-600" />
      case 'reconnecting':
        return <Activity className="h-4 w-4 text-amber-600" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Kết nối'
      case 'disconnected':
        return 'Mất kết nối'
      case 'reconnecting':
        return 'Đang kết nối lại'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'disconnected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'reconnecting':
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor()} ${className}`}
    >
      <motion.div
        animate={status === 'reconnecting' ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: status === 'reconnecting' ? Infinity : 0 }}
      >
        {getIcon()}
      </motion.div>
      <span>{getStatusText()}</span>
    </motion.div>
  )
}

interface DeviceStatusBadgeProps {
  deviceType: string
  status: 'online' | 'offline' | 'warning' | 'error'
  count?: number
  className?: string
}

export const DeviceStatusBadge: React.FC<DeviceStatusBadgeProps> = ({
  deviceType,
  status,
  count,
  className = ''
}) => {
  const getIcon = () => {
    switch (deviceType.toLowerCase()) {
      case 'facp':
      case 'gateway':
        return <Zap className="h-4 w-4" />
      case 'camera':
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'offline':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()} ${className}`}
    >
      {getIcon()}
      <span>{deviceType}</span>
      {count !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 bg-white/50 rounded text-xs">
          {count}
        </span>
      )}
      <StatusIndicator status={status} size="sm" />
    </motion.div>
  )
}

interface SystemHealthIndicatorProps {
  health: number // 0-100
  className?: string
}

export const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({
  health,
  className = ''
}) => {
  const getHealthColor = () => {
    if (health >= 90) return 'text-emerald-600'
    if (health >= 70) return 'text-amber-600'
    return 'text-red-600'
  }

  const getHealthBgColor = () => {
    if (health >= 90) return 'bg-emerald-500'
    if (health >= 70) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getHealthStatus = () => {
    if (health >= 90) return 'Tốt'
    if (health >= 70) return 'Cảnh báo'
    return 'Nghiêm trọng'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12">
        {/* Background circle */}
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <motion.path
            className={getHealthColor()}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            initial={{ strokeDasharray: "0 100" }}
            animate={{ strokeDasharray: `${health} 100` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${getHealthColor()}`}>
            {health}%
          </span>
        </div>
      </div>
      <div>
        <div className={`text-sm font-semibold ${getHealthColor()}`}>
          {getHealthStatus()}
        </div>
        <div className="text-xs text-slate-600">
          Sức khỏe hệ thống
        </div>
      </div>
    </div>
  )
}
