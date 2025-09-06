import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  Settings,
  Eye,
  ArrowRight,
  Monitor
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// === Dashboard Admin Department - Quản lý chi nhánh ===

interface DepartmentStats {
  departmentName: string
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  newDevicesLast7Days: number
  criticalAlerts: number
  technicalIssues: number
  lastUpdate: string
}

interface FloorData {
  floor: string
  devices: number
  online: number
  zones: number
  cameras: number
  status: 'normal' | 'warning' | 'critical'
}

// Mock data cho Department
const mockDepartmentStats: DepartmentStats = {
  departmentName: 'Chi nhánh TP.HCM',
  totalDevices: 234,
  onlineDevices: 218,
  offlineDevices: 16,
  newDevicesLast7Days: 5,
  criticalAlerts: 1,
  technicalIssues: 2,
  lastUpdate: new Date().toLocaleTimeString('vi-VN')
}

const mockFloors: FloorData[] = [
  { floor: 'Tầng 1', devices: 45, online: 42, zones: 8, cameras: 12, status: 'normal' },
  { floor: 'Tầng 2', devices: 38, online: 35, zones: 6, cameras: 10, status: 'warning' },
  { floor: 'Tầng 3', devices: 42, online: 40, zones: 7, cameras: 11, status: 'normal' },
  { floor: 'Tầng 4', devices: 35, online: 33, zones: 5, cameras: 9, status: 'normal' },
  { floor: 'Tầng 5', devices: 28, online: 26, zones: 4, cameras: 7, status: 'normal' },
  { floor: 'Tầng hầm B1', devices: 25, online: 22, zones: 4, cameras: 6, status: 'warning' },
  { floor: 'Tầng hầm B2', devices: 21, online: 20, zones: 3, cameras: 5, status: 'normal' }
]

const mockRecentIncidents = [
  { id: 1, type: 'fire', message: 'Báo cháy tầng 2 - Zone 3', time: '10:30', status: 'resolved' },
  { id: 2, type: 'technical', message: 'UPS tầng 4 mất điện', time: '09:15', status: 'active' },
  { id: 3, type: 'security', message: 'Camera hành lang tầng 1 offline', time: '08:45', status: 'active' }
]

export default function DepartmentDashboard() {
  const [stats, setStats] = useState<DepartmentStats>(mockDepartmentStats)
  const [floors, setFloors] = useState<FloorData[]>(mockFloors)
  const navigate = useNavigate()

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineDevices: Math.max(200, prev.onlineDevices + Math.floor(Math.random() * 3) - 1),
        lastUpdate: new Date().toLocaleTimeString('vi-VN')
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const onlinePercentage = ((stats.onlineDevices / stats.totalDevices) * 100).toFixed(1)

  const handleViewConsole = () => {
    navigate('/thiet-bi/console')
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Department</h1>
          <p className="text-slate-600 mt-1">{stats.departmentName} - Giám sát chi nhánh</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Cập nhật: {stats.lastUpdate}</span>
          </div>
          <Button onClick={handleViewConsole} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Monitor className="h-4 w-4 mr-2" />
            Console Plane
          </Button>
        </div>
      </motion.div>

      {/* Department Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng thiết bị chi nhánh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalDevices}</div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600">+{stats.newDevicesLast7Days} thiết bị mới</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tỷ lệ online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{onlinePercentage}%</div>
              <div className="flex items-center mt-2 text-sm">
                <Wifi className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-slate-600">{stats.onlineDevices}/{stats.totalDevices}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Cảnh báo nghiêm trọng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.criticalAlerts}</div>
              <div className="flex items-center mt-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-slate-600">Cần xử lý ngay</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Sự cố kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.technicalIssues}</div>
              <div className="flex items-center mt-2 text-sm">
                <Settings className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-slate-600">Đang xử lý</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floor Status and Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Trạng thái theo tầng
                </div>
                <Button variant="outline" size="sm" onClick={handleViewConsole}>
                  <Eye className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {floors.map((floor, index) => (
                  <motion.div
                    key={floor.floor}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      floor.status === 'normal' ? 'border-emerald-200 bg-emerald-50' :
                      floor.status === 'warning' ? 'border-amber-200 bg-amber-50' :
                      'border-red-200 bg-red-50'
                    }`}
                    onClick={handleViewConsole}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{floor.floor}</h3>
                      <div className={`w-3 h-3 rounded-full ${
                        floor.status === 'normal' ? 'bg-emerald-500' :
                        floor.status === 'warning' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-slate-500" />
                        <span>{floor.online}/{floor.devices} thiết bị</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-slate-500" />
                        <span>{floor.zones} zones</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="h-3 w-3 text-slate-500" />
                        <span>{floor.cameras} cameras</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-600">Xem chi tiết</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Sự cố gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentIncidents.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      incident.status === 'active' ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">{incident.message}</div>
                        <div className="text-xs text-slate-600 mt-1">{incident.time}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Xem tất cả sự cố
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleViewConsole}>
                <Monitor className="h-6 w-6" />
                <span className="text-sm">Console Plane</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Camera className="h-6 w-6" />
                <span className="text-sm">Camera Live</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Báo cáo</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Cài đặt</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
