import { store } from '@/store'
import { updateRealTimeMetrics, updateDeviceStatus } from '@/store/slices/deviceSlice'
import { addNotification, setConnectionStatus } from '@/store/slices/uiSlice'
import { createIncident } from '@/store/slices/incidentSlice'

// === WebSocket Service for Real-time Data ===

export interface WebSocketMessage {
  type: 'device_update' | 'incident_alert' | 'system_status' | 'heartbeat'
  payload: any
  timestamp: string
}

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 5000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private isConnecting = false

  constructor() {
    this.connect()
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.isConnecting = true
    
    try {
      // In production, this would be wss://your-websocket-server.com
      // For development, we'll simulate with a mock connection
      this.simulateConnection()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.handleConnectionError()
    }
  }

  private simulateConnection() {
    // Simulate WebSocket connection for development
    console.log('Simulating WebSocket connection...')
    
    // Simulate connection success
    setTimeout(() => {
      this.isConnecting = false
      this.reconnectAttempts = 0
      store.dispatch(setConnectionStatus('connected'))
      
      console.log('WebSocket connected (simulated)')
      
      // Start heartbeat
      this.startHeartbeat()
      
      // Start sending mock real-time data
      this.startMockDataStream()
      
    }, 1000)
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      // In real implementation, send heartbeat to server
      console.log('WebSocket heartbeat')
    }, 30000) // 30 seconds
  }

  private startMockDataStream() {
    // Simulate real-time device updates
    setInterval(() => {
      this.simulateDeviceUpdate()
    }, 5000) // Every 5 seconds

    // Simulate occasional incidents
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance
        this.simulateIncidentAlert()
      }
    }, 30000) // Every 30 seconds
  }

  private simulateDeviceUpdate() {
    const deviceIds = ['FACP-001', 'UPS-001', 'GW-A-001', 'GW-M-001']
    const randomDeviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)]
    
    const mockMetrics = {
      'FACP-001': {
        acVoltage: 220 + (Math.random() - 0.5) * 10,
        dcVoltage: 24 + (Math.random() - 0.5) * 2,
        temperature: 25 + (Math.random() - 0.5) * 5
      },
      'UPS-001': {
        voltage: 220 + (Math.random() - 0.5) * 10,
        current: 15 + (Math.random() - 0.5) * 5,
        batteryLevel: Math.max(0, Math.min(100, 85 + (Math.random() - 0.5) * 10))
      },
      'GW-A-001': {
        acVoltage: 220 + (Math.random() - 0.5) * 5,
        dcVoltage: 24 + (Math.random() - 0.5) * 1,
        temperature: 30 + (Math.random() - 0.5) * 3
      },
      'GW-M-001': {
        temperature: 28 + (Math.random() - 0.5) * 4,
        humidity: 60 + (Math.random() - 0.5) * 10,
        cpuUsage: Math.random() * 100
      }
    }

    const metrics = mockMetrics[randomDeviceId as keyof typeof mockMetrics]
    
    if (metrics) {
      store.dispatch(updateRealTimeMetrics({
        deviceId: randomDeviceId,
        metrics
      }))
    }

    // Occasionally simulate device status changes
    if (Math.random() < 0.05) { // 5% chance
      const statuses: Array<'online' | 'offline' | 'warning' | 'error'> = ['online', 'warning', 'error']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      store.dispatch(updateDeviceStatus({
        deviceId: randomDeviceId,
        status: randomStatus
      }))

      // Add notification for status change
      if (randomStatus !== 'online') {
        store.dispatch(addNotification({
          type: randomStatus === 'error' ? 'error' : 'warning',
          title: 'Device Status Change',
          message: `${randomDeviceId} status changed to ${randomStatus}`,
          duration: 5000
        }))
      }
    }
  }

  private simulateIncidentAlert() {
    const incidentTypes = ['fire', 'security', 'technical', 'sos'] as const
    const severities = ['low', 'medium', 'high', 'critical'] as const
    const branches = ['HCM-01', 'HN-01', 'DN-01']
    
    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)]
    const randomBranch = branches[Math.floor(Math.random() * branches.length)]
    
    const incidentTitles = {
      fire: ['Báo cháy phát hiện khói', 'Cảnh báo nhiệt độ cao', 'Kích hoạt detector'],
      security: ['Cửa an ninh mở bất thường', 'Camera mất kết nối', 'Cảm biến chuyển động'],
      technical: ['UPS mất điện', 'Gateway offline', 'Lỗi kết nối mạng'],
      sos: ['Nút SOS được kích hoạt', 'Cuộc gọi khẩn cấp', 'Yêu cầu hỗ trợ']
    }
    
    const titles = incidentTitles[randomType]
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    
    const mockIncident = {
      type: randomType,
      severity: randomSeverity,
      status: 'active' as const,
      title: randomTitle,
      description: `Sự cố ${randomType} được phát hiện tự động bởi hệ thống`,
      location: {
        branch: randomBranch,
        floor: `Tầng ${Math.floor(Math.random() * 5) + 1}`,
        zone: `Zone ${Math.floor(Math.random() * 8) + 1}`
      },
      devices: [`DEV-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`],
      reportedBy: 'System Auto',
      notes: [],
      attachments: [],
      escalated: false
    }

    store.dispatch(createIncident(mockIncident))

    // Add notification
    store.dispatch(addNotification({
      type: randomSeverity === 'critical' || randomSeverity === 'high' ? 'error' : 'warning',
      title: 'New Incident Alert',
      message: `${randomTitle} - ${randomBranch}`,
      duration: 10000
    }))
  }

  private handleConnectionError() {
    this.isConnecting = false
    store.dispatch(setConnectionStatus('disconnected'))
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`WebSocket reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
      
      store.dispatch(setConnectionStatus('reconnecting'))
      
      setTimeout(() => {
        this.connect()
      }, this.reconnectInterval * this.reconnectAttempts)
    } else {
      console.error('WebSocket max reconnection attempts reached')
      store.dispatch(addNotification({
        type: 'error',
        title: 'Connection Lost',
        message: 'Unable to connect to real-time data service. Please refresh the page.',
        duration: 0 // Persistent notification
      }))
    }
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    store.dispatch(setConnectionStatus('disconnected'))
    console.log('WebSocket disconnected')
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, message not sent:', message)
    }
  }

  // Public methods for manual control
  reconnect() {
    this.disconnect()
    this.reconnectAttempts = 0
    this.connect()
  }

  getConnectionStatus() {
    if (!this.ws) return 'disconnected'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'reconnecting'
      case WebSocket.OPEN:
        return 'connected'
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
      default:
        return 'disconnected'
    }
  }
}

// Create singleton instance
export const websocketService = new WebSocketService()

// Export for use in components
export default websocketService
