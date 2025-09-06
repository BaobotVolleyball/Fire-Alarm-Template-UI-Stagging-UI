import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// === Device Management State ===

export interface Device {
  id: string
  name: string
  type: 'GW-A' | 'GW-M' | 'FACP' | 'UPS' | 'Fan' | 'Pump' | 'Door' | 'Generator' | 'Camera' | 'Sensor'
  status: 'online' | 'offline' | 'warning' | 'error'
  branch: string
  location: string
  metrics: Record<string, any>
  lastSeen: string
  uplink?: string
  coordinates?: { lat: number; lng: number }
}

export interface Branch {
  id: string
  name: string
  address: string
  status: 'online' | 'offline' | 'warning'
  deviceCount: number
  onlineDevices: number
  lastUpdate: string
  coordinates?: { lat: number; lng: number }
}

export interface Gateway {
  id: string
  type: 'GW-A' | 'GW-M'
  name: string
  status: 'online' | 'offline'
  branch: string
  devices: string[] // Device IDs connected to this gateway
  metrics: Record<string, any>
  lastSeen: string
}

interface DeviceState {
  devices: Device[]
  branches: Branch[]
  gateways: Gateway[]
  selectedBranch: string | null
  selectedDevice: string | null
  loading: boolean
  error: string | null
  lastUpdate: string
  realTimeEnabled: boolean
}

const initialState: DeviceState = {
  devices: [],
  branches: [],
  gateways: [],
  selectedBranch: null,
  selectedDevice: null,
  loading: false,
  error: null,
  lastUpdate: new Date().toISOString(),
  realTimeEnabled: true,
}

// Async thunks for API calls
export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (branchId?: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - in real app, this would be API call
    const mockDevices: Device[] = [
      {
        id: 'GW-A-001',
        name: 'Gateway Alarm - Tầng 1',
        type: 'GW-A',
        status: 'online',
        branch: 'HCM-01',
        location: 'Tầng 1 - Phòng điều khiển',
        metrics: { acVoltage: 220.5, dcVoltage: 24.2 },
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'GW-M-001',
        name: 'Gateway Metrics - Tầng 1',
        type: 'GW-M',
        status: 'online',
        branch: 'HCM-01',
        location: 'Tầng 1 - Phòng kỹ thuật',
        metrics: { temperature: 25.5, humidity: 60 },
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'FACP-001',
        name: 'FACP Tầng 1',
        type: 'FACP',
        status: 'online',
        branch: 'HCM-01',
        location: 'Tầng 1 - Sảnh chính',
        uplink: 'GW-A-001',
        metrics: { 
          acVoltage: 220.3, 
          dcVoltage: 24.1,
          zones: [
            { zone: 1, status: 0, description: 'Hành lang chính' },
            { zone: 2, status: 1, description: 'Phòng kho' },
            { zone: 3, status: 0, description: 'Văn phòng A' },
            { zone: 4, status: 2, description: 'Thang máy' }
          ]
        },
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'UPS-001',
        name: 'UPS Tầng 1',
        type: 'UPS',
        status: 'warning',
        branch: 'HCM-01',
        location: 'Tầng 1 - Phòng kỹ thuật',
        uplink: 'GW-M-001',
        metrics: { 
          voltage: 198.5, 
          current: 15.2,
          batteryLevel: 85,
          status: 'ON'
        },
        lastSeen: new Date().toISOString(),
      }
    ]
    
    return branchId ? mockDevices.filter(d => d.branch === branchId) : mockDevices
  }
)

export const fetchBranches = createAsyncThunk(
  'devices/fetchBranches',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockBranches: Branch[] = [
      {
        id: 'HCM-01',
        name: 'Chi nhánh TP.HCM',
        address: 'Tòa nhà A, 123 Đường Nguyễn Huệ, Q1, TP.HCM',
        status: 'online',
        deviceCount: 234,
        onlineDevices: 218,
        lastUpdate: new Date().toISOString(),
        coordinates: { lat: 10.7769, lng: 106.7009 }
      },
      {
        id: 'HN-01',
        name: 'Chi nhánh Hà Nội',
        address: 'Tòa nhà B, 456 Đường Hoàn Kiếm, Hà Nội',
        status: 'online',
        deviceCount: 198,
        onlineDevices: 185,
        lastUpdate: new Date().toISOString(),
        coordinates: { lat: 21.0285, lng: 105.8542 }
      },
      {
        id: 'DN-01',
        name: 'Chi nhánh Đà Nẵng',
        address: 'Tòa nhà C, 789 Đường Hàn, Đà Nẵng',
        status: 'warning',
        deviceCount: 156,
        onlineDevices: 142,
        lastUpdate: new Date().toISOString(),
        coordinates: { lat: 16.0471, lng: 108.2068 }
      }
    ]
    
    return mockBranches
  }
)

export const updateDeviceMetrics = createAsyncThunk(
  'devices/updateDeviceMetrics',
  async (payload: { deviceId: string; metrics: Record<string, any> }) => {
    // Simulate real-time update
    return payload
  }
)

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setSelectedBranch: (state, action: PayloadAction<string | null>) => {
      state.selectedBranch = action.payload
    },
    setSelectedDevice: (state, action: PayloadAction<string | null>) => {
      state.selectedDevice = action.payload
    },
    updateDeviceStatus: (state, action: PayloadAction<{ deviceId: string; status: Device['status'] }>) => {
      const device = state.devices.find(d => d.id === action.payload.deviceId)
      if (device) {
        device.status = action.payload.status
        device.lastSeen = new Date().toISOString()
      }
    },
    updateRealTimeMetrics: (state, action: PayloadAction<{ deviceId: string; metrics: Record<string, any> }>) => {
      const device = state.devices.find(d => d.id === action.payload.deviceId)
      if (device) {
        device.metrics = { ...device.metrics, ...action.payload.metrics }
        device.lastSeen = new Date().toISOString()
      }
      state.lastUpdate = new Date().toISOString()
    },
    toggleRealTime: (state) => {
      state.realTimeEnabled = !state.realTimeEnabled
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch devices
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false
        state.devices = action.payload
        state.lastUpdate = new Date().toISOString()
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch devices'
      })
      // Fetch branches
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false
        state.branches = action.payload
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch branches'
      })
      // Update device metrics
      .addCase(updateDeviceMetrics.fulfilled, (state, action) => {
        const device = state.devices.find(d => d.id === action.payload.deviceId)
        if (device) {
          device.metrics = { ...device.metrics, ...action.payload.metrics }
          device.lastSeen = new Date().toISOString()
        }
      })
  },
})

export const {
  setSelectedBranch,
  setSelectedDevice,
  updateDeviceStatus,
  updateRealTimeMetrics,
  toggleRealTime,
  clearError
} = deviceSlice.actions

export default deviceSlice.reducer
