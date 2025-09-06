import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Shield,
  Camera,
  Zap,
  Gauge,
  Wifi,
  WifiOff,
  Power,
  Droplets,
  Wind,
  DoorOpen,
  DoorClosed,
  Volume2,
  Eye,
  Settings,
  RefreshCw,
  Maximize2,
  Filter,
  Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// === Console Plane - Màn hình giám sát chi tiết ===

// Gateway Architecture Types
interface GatewayAlarm {
  id: string
  name: string
  status: 'online' | 'offline' | 'warning'
  acVoltage: number
  dcVoltage: number
  zones: ZoneStatus[]
  inputs: InputChannel[]
  outputs: OutputChannel[]
  lastUpdate: string
}

interface GatewayMetrics {
  id: string
  name: string
  status: 'online' | 'offline' | 'warning'
  ups: UPSMetrics
  smokeFan: FanMetrics
  waterPump: PumpMetrics
  emergencyDoor: DoorStatus
  generator: GeneratorStatus
  lastUpdate: string
}

interface ZoneStatus {
  zone: number
  status: 0 | 1 | 2 | 3 // 0=Bình thường, 1=Cháy, 2=Hở mạch, 3=Chập mạch
  description: string
}

interface InputChannel {
  channel: number
  name: string
  status: boolean
  type: 'SOS' | 'Door' | 'Custom'
}

interface OutputChannel {
  channel: number
  name: string
  status: boolean
  type: 'Siren' | 'Smoke' | 'Power' | 'Custom'
}

interface UPSMetrics {
  voltage: number
  current: number
  warningThreshold: { voltage: [number, number], current: [number, number] }
  status: 'normal' | 'warning' | 'critical'
}

interface FanMetrics {
  voltage: number
  current: number
  warningThreshold: { voltage: [number, number], current: [number, number] }
  status: 'normal' | 'warning' | 'critical'
}

interface PumpMetrics {
  voltage: number
  current: number
  pipePressure: number
  waterFlow: number
  warningThreshold: {
    voltage: [number, number]
    current: [number, number]
    pressure: [number, number]
    flow: [number, number]
  }
  status: 'normal' | 'warning' | 'critical'
}

interface DoorStatus {
  state: 0 | 1 // 0=Mở, 1=Đóng
  status: 'normal' | 'warning'
}

interface GeneratorStatus {
  state: 0 | 1 // 0=Tắt, 1=Hoạt động
  status: 'normal' | 'warning'
}

interface CameraDevice {
  id: string
  name: string
  location: string
  group: string
  connectionStatus: 'online' | 'offline'
  recordingStatus: boolean
  liveStreamUrl?: string
  snapshotUrl?: string
}

// Mock data
const mockGatewayAlarms: GatewayAlarm[] = [
  {
    id: 'GWA-001',
    name: 'Gateway Alarm - Tầng 1',
    status: 'online',
    acVoltage: 220.5,
    dcVoltage: 24.2,
    zones: [
      { zone: 1, status: 0, description: 'Hành lang chính' },
      { zone: 2, status: 1, description: 'Phòng kho' },
      { zone: 3, status: 0, description: 'Văn phòng A' },
      { zone: 4, status: 2, description: 'Thang máy' },
      { zone: 5, status: 0, description: 'Phòng họp' },
      { zone: 6, status: 0, description: 'Nhà vệ sinh' },
      { zone: 7, status: 3, description: 'Phòng điện' },
      { zone: 8, status: 0, description: 'Lối thoát hiểm' }
    ],
    inputs: [
      { channel: 1, name: 'SOS Button', status: false, type: 'SOS' },
      { channel: 2, name: 'Door Sensor', status: true, type: 'Door' },
      { channel: 3, name: 'Custom Input 1', status: false, type: 'Custom' },
      { channel: 4, name: 'Custom Input 2', status: false, type: 'Custom' }
    ],
    outputs: [
      { channel: 1, name: 'Siren', status: true, type: 'Siren' },
      { channel: 2, name: 'Smoke Release', status: false, type: 'Smoke' },
      { channel: 3, name: 'Power Switch', status: true, type: 'Power' },
      { channel: 4, name: 'Custom Output', status: false, type: 'Custom' }
    ],
    lastUpdate: new Date().toLocaleTimeString('vi-VN')
  }
]

const mockGatewayMetrics: GatewayMetrics[] = [
  {
    id: 'GWM-001',
    name: 'Gateway Metrics - Tầng 1',
    status: 'online',
    ups: {
      voltage: 220.5,
      current: 15.2,
      warningThreshold: { voltage: [200, 240], current: [0, 20] },
      status: 'normal'
    },
    smokeFan: {
      voltage: 380.2,
      current: 8.5,
      warningThreshold: { voltage: [360, 400], current: [0, 12] },
      status: 'normal'
    },
    waterPump: {
      voltage: 380.1,
      current: 12.3,
      pipePressure: 6.8,
      waterFlow: 45.2,
      warningThreshold: {
        voltage: [360, 400],
        current: [0, 15],
        pressure: [5, 8],
        flow: [40, 60]
      },
      status: 'warning'
    },
    emergencyDoor: { state: 1, status: 'normal' },
    generator: { state: 0, status: 'normal' },
    lastUpdate: new Date().toLocaleTimeString('vi-VN')
  }
]

const mockCameras: CameraDevice[] = [
  { id: 'CAM-001', name: 'Camera Hành lang T1', location: 'Tầng 1 - Hành lang chính', group: 'Zone 1', connectionStatus: 'online', recordingStatus: true },
  { id: 'CAM-002', name: 'Camera Phòng kho', location: 'Tầng 1 - Phòng kho', group: 'Zone 2', connectionStatus: 'online', recordingStatus: true },
  { id: 'CAM-003', name: 'Camera Văn phòng A', location: 'Tầng 1 - Văn phòng A', group: 'Zone 3', connectionStatus: 'offline', recordingStatus: false },
  { id: 'CAM-004', name: 'Camera Thang máy', location: 'Tầng 1 - Thang máy', group: 'Zone 4', connectionStatus: 'online', recordingStatus: true }
]

export default function ConsolePlane() {
  const [gatewayAlarms, setGatewayAlarms] = useState<GatewayAlarm[]>(mockGatewayAlarms)
  const [gatewayMetrics, setGatewayMetrics] = useState<GatewayMetrics[]>(mockGatewayMetrics)
  const [cameras, setCameras] = useState<CameraDevice[]>(mockCameras)
  const [selectedView, setSelectedView] = useState<'overview' | 'alarms' | 'metrics' | 'cameras'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Real-time updates simulation
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Update timestamps
      setGatewayAlarms(prev => prev.map(gw => ({
        ...gw,
        lastUpdate: new Date().toLocaleTimeString('vi-VN'),
        acVoltage: 220 + Math.random() * 5,
        dcVoltage: 24 + Math.random() * 0.5
      })))

      setGatewayMetrics(prev => prev.map(gw => ({
        ...gw,
        lastUpdate: new Date().toLocaleTimeString('vi-VN'),
        ups: {
          ...gw.ups,
          voltage: 220 + Math.random() * 5,
          current: 15 + Math.random() * 2
        }
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const getZoneStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-emerald-500'
      case 1: return 'bg-red-500'
      case 2: return 'bg-amber-500'
      case 3: return 'bg-purple-500'
      default: return 'bg-slate-500'
    }
  }

  const getZoneStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Bình thường'
      case 1: return 'Cháy'
      case 2: return 'Hở mạch'
      case 3: return 'Chập mạch'
      default: return 'Không xác định'
    }
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-emerald-600'
      case 'warning': return 'text-amber-600'
      case 'critical': return 'text-red-600'
      default: return 'text-slate-600'
    }
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
          <h1 className="text-3xl font-bold text-slate-900">Console Plane</h1>
          <p className="text-slate-600 mt-1">Màn hình giám sát chi tiết - Gateway Architecture</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm thiết bị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
        </div>
      </motion.div>

      {/* View Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm"
      >
        {[
          { key: 'overview', label: 'Tổng quan', icon: Activity },
          { key: 'alarms', label: 'GW-A (Alarm)', icon: Shield },
          { key: 'metrics', label: 'GW-M (Metrics)', icon: Gauge },
          { key: 'cameras', label: 'Camera System', icon: Camera }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={selectedView === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedView(key as any)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </motion.div>

      {/* Content based on selected view */}
      <AnimatePresence mode="wait">
        {selectedView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Gateway Alarms Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  GW-A (Gateway Alarm) Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gatewayAlarms.map((gw) => (
                  <div key={gw.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{gw.name}</h3>
                        <p className="text-sm text-slate-600">AC: {gw.acVoltage.toFixed(1)}V | DC: {gw.dcVoltage.toFixed(1)}V</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${gw.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {gw.zones.slice(0, 8).map((zone) => (
                        <div
                          key={zone.zone}
                          className={`p-2 rounded text-center text-xs font-medium text-white ${getZoneStatusColor(zone.status)}`}
                        >
                          Zone {zone.zone}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Gateway Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  GW-M (Gateway Metrics) Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gatewayMetrics.map((gw) => (
                  <div key={gw.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{gw.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${gw.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span>UPS: {gw.ups.voltage.toFixed(1)}V</span>
                        <span className={getMetricStatusColor(gw.ups.status)}>●</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-600" />
                        <span>Fan: {gw.smokeFan.voltage.toFixed(1)}V</span>
                        <span className={getMetricStatusColor(gw.smokeFan.status)}>●</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        <span>Pump: {gw.waterPump.pipePressure.toFixed(1)} bar</span>
                        <span className={getMetricStatusColor(gw.waterPump.status)}>●</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {gw.emergencyDoor.state === 1 ? <DoorClosed className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
                        <span>Door: {gw.emergencyDoor.state === 1 ? 'Đóng' : 'Mở'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* GW-A Detailed View */}
        {selectedView === 'alarms' && (
          <motion.div
            key="alarms"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {gatewayAlarms.map((gw) => (
              <div key={gw.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gateway Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      {gw.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{gw.acVoltage.toFixed(1)}V</div>
                        <div className="text-sm text-slate-600">AC Voltage</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{gw.dcVoltage.toFixed(1)}V</div>
                        <div className="text-sm text-slate-600">DC Voltage</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Cập nhật: {gw.lastUpdate}
                    </div>
                  </CardContent>
                </Card>

                {/* Zone Status Grid */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Zone Status (8 zones)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {gw.zones.map((zone) => (
                        <motion.div
                          key={zone.zone}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            zone.status === 0 ? 'border-emerald-200 bg-emerald-50' :
                            zone.status === 1 ? 'border-red-200 bg-red-50' :
                            zone.status === 2 ? 'border-amber-200 bg-amber-50' :
                            'border-purple-200 bg-purple-50'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getZoneStatusColor(zone.status)}`} />
                            <div className="font-semibold text-slate-900">Zone {zone.zone}</div>
                            <div className="text-xs text-slate-600 mt-1">{getZoneStatusText(zone.status)}</div>
                            <div className="text-xs text-slate-500 mt-1">{zone.description}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Input Channels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Input Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {gw.inputs.map((input) => (
                        <div key={input.channel} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div>
                            <div className="font-medium text-sm">CH{input.channel}: {input.name}</div>
                            <div className="text-xs text-slate-600">{input.type}</div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${input.status ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Output Channels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      Output Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {gw.outputs.map((output) => (
                        <div key={output.channel} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div>
                            <div className="font-medium text-sm">CH{output.channel}: {output.name}</div>
                            <div className="text-xs text-slate-600">{output.type}</div>
                          </div>
                          <Button
                            size="sm"
                            variant={output.status ? "destructive" : "outline"}
                            className="h-6 px-2 text-xs"
                          >
                            {output.status ? 'ON' : 'OFF'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
        )}

        {/* GW-M Detailed View */}
        {selectedView === 'metrics' && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {gatewayMetrics.map((gw) => (
              <div key={gw.id} className="space-y-6">
                {/* Gateway Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-blue-600" />
                        {gw.name}
                      </div>
                      <div className="text-sm text-slate-500">Cập nhật: {gw.lastUpdate}</div>
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* UPS Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        UPS System
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-xl font-bold text-yellow-600">{gw.ups.voltage.toFixed(1)}V</div>
                          <div className="text-xs text-slate-600">Voltage</div>
                          <div className="text-xs text-slate-500">
                            ({gw.ups.warningThreshold.voltage[0]}-{gw.ups.warningThreshold.voltage[1]}V)
                          </div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-xl font-bold text-yellow-600">{gw.ups.current.toFixed(1)}A</div>
                          <div className="text-xs text-slate-600">Current</div>
                          <div className="text-xs text-slate-500">
                            (0-{gw.ups.warningThreshold.current[1]}A)
                          </div>
                        </div>
                      </div>
                      <div className={`text-center p-2 rounded font-medium ${
                        gw.ups.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                        gw.ups.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {gw.ups.status === 'normal' ? 'Bình thường' :
                         gw.ups.status === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Smoke Fan Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-blue-600" />
                        Smoke Fan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">{gw.smokeFan.voltage.toFixed(1)}V</div>
                          <div className="text-xs text-slate-600">Voltage</div>
                          <div className="text-xs text-slate-500">
                            ({gw.smokeFan.warningThreshold.voltage[0]}-{gw.smokeFan.warningThreshold.voltage[1]}V)
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">{gw.smokeFan.current.toFixed(1)}A</div>
                          <div className="text-xs text-slate-600">Current</div>
                          <div className="text-xs text-slate-500">
                            (0-{gw.smokeFan.warningThreshold.current[1]}A)
                          </div>
                        </div>
                      </div>
                      <div className={`text-center p-2 rounded font-medium ${
                        gw.smokeFan.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                        gw.smokeFan.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {gw.smokeFan.status === 'normal' ? 'Bình thường' :
                         gw.smokeFan.status === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Water Pump Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-cyan-600" />
                        Water Pump
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-cyan-50 rounded-lg">
                          <div className="text-xl font-bold text-cyan-600">{gw.waterPump.voltage.toFixed(1)}V</div>
                          <div className="text-xs text-slate-600">Voltage</div>
                        </div>
                        <div className="text-center p-3 bg-cyan-50 rounded-lg">
                          <div className="text-xl font-bold text-cyan-600">{gw.waterPump.current.toFixed(1)}A</div>
                          <div className="text-xs text-slate-600">Current</div>
                        </div>
                        <div className="text-center p-3 bg-cyan-50 rounded-lg">
                          <div className="text-xl font-bold text-cyan-600">{gw.waterPump.pipePressure.toFixed(1)}</div>
                          <div className="text-xs text-slate-600">Pressure (bar)</div>
                        </div>
                        <div className="text-center p-3 bg-cyan-50 rounded-lg">
                          <div className="text-xl font-bold text-cyan-600">{gw.waterPump.waterFlow.toFixed(1)}</div>
                          <div className="text-xs text-slate-600">Flow (L/min)</div>
                        </div>
                      </div>
                      <div className={`text-center p-2 rounded font-medium ${
                        gw.waterPump.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                        gw.waterPump.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {gw.waterPump.status === 'normal' ? 'Bình thường' :
                         gw.waterPump.status === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emergency Door & Generator */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DoorClosed className="h-5 w-5 text-slate-600" />
                        Emergency Door
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        {gw.emergencyDoor.state === 1 ? (
                          <DoorClosed className="h-12 w-12 mx-auto text-emerald-600 mb-2" />
                        ) : (
                          <DoorOpen className="h-12 w-12 mx-auto text-red-600 mb-2" />
                        )}
                        <div className="font-semibold">
                          {gw.emergencyDoor.state === 1 ? 'Đóng' : 'Mở'}
                        </div>
                        <div className={`text-sm ${
                          gw.emergencyDoor.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {gw.emergencyDoor.status === 'normal' ? 'Bình thường' : 'Cảnh báo'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Power className="h-5 w-5 text-slate-600" />
                        Generator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <Power className={`h-12 w-12 mx-auto mb-2 ${
                          gw.generator.state === 1 ? 'text-emerald-600' : 'text-slate-400'
                        }`} />
                        <div className="font-semibold">
                          {gw.generator.state === 1 ? 'Hoạt động' : 'Tắt'}
                        </div>
                        <div className={`text-sm ${
                          gw.generator.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {gw.generator.status === 'normal' ? 'Bình thường' : 'Cảnh báo'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Camera System View */}
        {selectedView === 'cameras' && (
          <motion.div
            key="cameras"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Camera Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cameras.map((camera, index) => (
                <motion.div
                  key={camera.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{camera.name}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          camera.connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Camera Preview */}
                      <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                        {camera.connectionStatus === 'online' ? (
                          <div className="text-center text-white">
                            <Camera className="h-8 w-8 mx-auto mb-2" />
                            <div className="text-xs">Live Stream</div>
                          </div>
                        ) : (
                          <div className="text-center text-slate-400">
                            <WifiOff className="h-8 w-8 mx-auto mb-2" />
                            <div className="text-xs">Offline</div>
                          </div>
                        )}
                      </div>

                      {/* Camera Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-600">{camera.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-600">{camera.group}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-600">Recording</span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            camera.recordingStatus ? 'bg-red-500' : 'bg-slate-400'
                          }`} />
                        </div>
                      </div>

                      {/* Camera Controls */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Maximize2 className="h-3 w-3 mr-1" />
                          Full
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Camera Controls Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Camera System Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">All Cameras</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Eye className="h-6 w-6" />
                    <span className="text-sm">Live View</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Recording</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Settings className="h-6 w-6" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
