import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Activity,
  Wifi,
  WifiOff,
  TrendingUp,
  AlertTriangle,
  Shield,
  Camera,
  Zap,
  BarChart3,
  MapPin,
  Clock,
  Users,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// === Dashboard Admin Tenant - Quản lý toàn tổ chức ===

interface OrganizationStats {
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  newDevicesLast7Days: number
  totalBranches: number
  activeBranches: number
  criticalAlerts: number
  technicalIssues: number
}

interface DeviceTypeStats {
  type: string
  total: number
  online: number
  offline: number
  percentage: number
  icon: any
  color: string
}

// Mock data cho demo
const mockStats: OrganizationStats = {
  totalDevices: 1247,
  onlineDevices: 1156,
  offlineDevices: 91,
  newDevicesLast7Days: 23,
  totalBranches: 15,
  activeBranches: 14,
  criticalAlerts: 3,
  technicalIssues: 7
}

const mockDeviceTypes: DeviceTypeStats[] = [
  { type: 'FACP', total: 45, online: 42, offline: 3, percentage: 93.3, icon: Shield, color: 'text-red-600' },
  { type: 'Camera', total: 320, online: 298, offline: 22, percentage: 93.1, icon: Camera, color: 'text-blue-600' },
  { type: 'Gateway', total: 30, online: 28, offline: 2, percentage: 93.3, icon: Wifi, color: 'text-green-600' },
  { type: 'UPS', total: 60, online: 55, offline: 5, percentage: 91.7, icon: Zap, color: 'text-yellow-600' },
  { type: 'Sensor', total: 792, online: 733, offline: 59, percentage: 92.5, icon: Activity, color: 'text-purple-600' }
]

const mockBranches = [
  { id: 'HCM-01', name: 'Chi nhánh TP.HCM', devices: 234, online: 218, status: 'online' as const },
  { id: 'HN-01', name: 'Chi nhánh Hà Nội', devices: 198, online: 185, status: 'online' as const },
  { id: 'DN-01', name: 'Chi nhánh Đà Nẵng', devices: 156, online: 142, status: 'warning' as const },
  { id: 'CT-01', name: 'Chi nhánh Cần Thơ', devices: 123, online: 115, status: 'online' as const },
  { id: 'HP-01', name: 'Chi nhánh Hải Phòng', devices: 98, online: 89, status: 'warning' as const }
]

export default function TenantDashboard() {
  const [stats, setStats] = useState<OrganizationStats>(mockStats)
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeStats[]>(mockDeviceTypes)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineDevices: prev.onlineDevices + Math.floor(Math.random() * 3) - 1,
        offlineDevices: prev.totalDevices - (prev.onlineDevices + Math.floor(Math.random() * 3) - 1)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const onlinePercentage = useMemo(() => 
    ((stats.onlineDevices / stats.totalDevices) * 100).toFixed(1)
  , [stats])

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Admin Tenant</h1>
          <p className="text-slate-600 mt-1">Tổng quan toàn tổ chức - Quản lý tập trung</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Hệ thống ổn định</span>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
        </div>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng số thiết bị</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalDevices.toLocaleString()}</div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600">+{stats.newDevicesLast7Days} thiết bị mới (7 ngày)</span>
              </div>
            </CardContent>
            <div className="absolute top-4 right-4">
              <Building2 className="h-8 w-8 text-slate-300" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tỷ lệ thiết bị online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{onlinePercentage}%</div>
              <div className="flex items-center mt-2 text-sm">
                <Wifi className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-slate-600">{stats.onlineDevices}/{stats.totalDevices} thiết bị</span>
              </div>
            </CardContent>
            <div className="absolute top-4 right-4">
              <Activity className="h-8 w-8 text-emerald-300" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Chi nhánh hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.activeBranches}/{stats.totalBranches}</div>
              <div className="flex items-center mt-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-slate-600">Trên toàn quốc</span>
              </div>
            </CardContent>
            <div className="absolute top-4 right-4">
              <Building2 className="h-8 w-8 text-blue-300" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Cảnh báo quan trọng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.criticalAlerts}</div>
              <div className="flex items-center mt-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-slate-600">Cần xử lý ngay</span>
              </div>
            </CardContent>
            <div className="absolute top-4 right-4">
              <AlertTriangle className="h-8 w-8 text-red-300" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Types Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tỷ lệ Online/Offline theo từng loại thiết bị
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceTypes.map((device, index) => {
                  const Icon = device.icon
                  return (
                    <motion.div
                      key={device.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${device.color}`} />
                        <div>
                          <div className="font-semibold text-slate-900">{device.type}</div>
                          <div className="text-sm text-slate-600">{device.online}/{device.total} thiết bị</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{device.percentage}%</div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${device.percentage}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Branch Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trạng thái Chi nhánh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBranches.map((branch, index) => (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{branch.name}</div>
                      <div className="text-sm text-slate-600">{branch.online}/{branch.devices} thiết bị</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      branch.status === 'online' ? 'bg-emerald-500' : 
                      branch.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Xem tất cả chi nhánh
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
