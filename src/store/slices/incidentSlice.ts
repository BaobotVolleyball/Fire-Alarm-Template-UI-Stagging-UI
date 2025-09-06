import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// === Incident Management State ===

export interface Incident {
  id: string
  type: 'fire' | 'security' | 'sos' | 'technical'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'acknowledged' | 'resolved' | 'false_alarm'
  title: string
  description: string
  location: {
    branch: string
    floor?: string
    zone?: string
    coordinates?: { lat: number; lng: number }
  }
  devices: string[] // Device IDs involved
  assignedTo?: string
  reportedBy?: string
  occurredAt: string
  acknowledgedAt?: string
  resolvedAt?: string
  responseTime?: number // in seconds
  resolutionTime?: number // in seconds
  notes: string[]
  attachments: string[]
  escalated: boolean
}

export interface IncidentStats {
  total: number
  active: number
  resolved: number
  falseAlarms: number
  averageResponseTime: number
  averageResolutionTime: number
  byType: Record<string, number>
  bySeverity: Record<string, number>
  byBranch: Record<string, number>
}

interface IncidentState {
  incidents: Incident[]
  activeIncidents: Incident[]
  stats: IncidentStats
  selectedIncident: string | null
  filters: {
    type: string[]
    severity: string[]
    status: string[]
    branch: string[]
    dateRange: { start: string; end: string }
  }
  loading: boolean
  error: string | null
  lastUpdate: string
  realTimeEnabled: boolean
}

const initialState: IncidentState = {
  incidents: [],
  activeIncidents: [],
  stats: {
    total: 0,
    active: 0,
    resolved: 0,
    falseAlarms: 0,
    averageResponseTime: 0,
    averageResolutionTime: 0,
    byType: {},
    bySeverity: {},
    byBranch: {}
  },
  selectedIncident: null,
  filters: {
    type: [],
    severity: [],
    status: [],
    branch: [],
    dateRange: { start: '', end: '' }
  },
  loading: false,
  error: null,
  lastUpdate: new Date().toISOString(),
  realTimeEnabled: true,
}

// Async thunks
export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async (filters?: Partial<IncidentState['filters']>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockIncidents: Incident[] = [
      {
        id: 'INC-001',
        type: 'fire',
        severity: 'high',
        status: 'active',
        title: 'Báo cháy tầng 2 - Zone 3',
        description: 'Phát hiện khói tại phòng kho tầng 2',
        location: {
          branch: 'HCM-01',
          floor: 'Tầng 2',
          zone: 'Zone 3',
          coordinates: { lat: 10.7769, lng: 106.7009 }
        },
        devices: ['FACP-001', 'CAM-002'],
        reportedBy: 'System Auto',
        occurredAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        notes: ['Phát hiện khói từ detector', 'Đã kích hoạt báo động'],
        attachments: [],
        escalated: false
      },
      {
        id: 'INC-002',
        type: 'technical',
        severity: 'medium',
        status: 'acknowledged',
        title: 'UPS tầng 4 mất điện',
        description: 'UPS backup power system offline',
        location: {
          branch: 'HCM-01',
          floor: 'Tầng 4',
          zone: 'Phòng kỹ thuật'
        },
        devices: ['UPS-004'],
        assignedTo: 'Nguyễn Văn A',
        reportedBy: 'System Auto',
        occurredAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
        acknowledgedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        responseTime: 300, // 5 minutes
        notes: ['Kiểm tra nguồn điện chính', 'Đang thay thế UPS'],
        attachments: [],
        escalated: false
      },
      {
        id: 'INC-003',
        type: 'security',
        severity: 'low',
        status: 'resolved',
        title: 'Camera hành lang tầng 1 offline',
        description: 'Mất kết nối camera giám sát',
        location: {
          branch: 'HCM-01',
          floor: 'Tầng 1',
          zone: 'Hành lang chính'
        },
        devices: ['CAM-001'],
        assignedTo: 'Trần Thị B',
        reportedBy: 'System Auto',
        occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        acknowledgedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        responseTime: 600, // 10 minutes
        resolutionTime: 4800, // 80 minutes
        notes: ['Kiểm tra kết nối mạng', 'Khởi động lại camera', 'Đã hoạt động bình thường'],
        attachments: [],
        escalated: false
      }
    ]
    
    return mockIncidents
  }
)

export const createIncident = createAsyncThunk(
  'incidents/createIncident',
  async (incidentData: Omit<Incident, 'id' | 'occurredAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newIncident: Incident = {
      ...incidentData,
      id: `INC-${Date.now()}`,
      occurredAt: new Date().toISOString()
    }
    
    return newIncident
  }
)

export const updateIncident = createAsyncThunk(
  'incidents/updateIncident',
  async (payload: { id: string; updates: Partial<Incident> }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return payload
  }
)

export const acknowledgeIncident = createAsyncThunk(
  'incidents/acknowledgeIncident',
  async (payload: { id: string; acknowledgedBy: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
      id: payload.id,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: payload.acknowledgedBy,
      status: 'acknowledged' as const
    }
  }
)

export const resolveIncident = createAsyncThunk(
  'incidents/resolveIncident',
  async (payload: { id: string; resolvedBy: string; notes?: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      id: payload.id,
      resolvedAt: new Date().toISOString(),
      resolvedBy: payload.resolvedBy,
      status: 'resolved' as const,
      notes: payload.notes
    }
  }
)

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setSelectedIncident: (state, action: PayloadAction<string | null>) => {
      state.selectedIncident = action.payload
    },
    updateFilters: (state, action: PayloadAction<Partial<IncidentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        type: [],
        severity: [],
        status: [],
        branch: [],
        dateRange: { start: '', end: '' }
      }
    },
    addIncidentNote: (state, action: PayloadAction<{ id: string; note: string }>) => {
      const incident = state.incidents.find(i => i.id === action.payload.id)
      if (incident) {
        incident.notes.push(`${new Date().toLocaleTimeString()}: ${action.payload.note}`)
      }
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
      // Fetch incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false
        state.incidents = action.payload
        state.activeIncidents = action.payload.filter(i => i.status === 'active')
        
        // Calculate stats
        const total = action.payload.length
        const active = action.payload.filter(i => i.status === 'active').length
        const resolved = action.payload.filter(i => i.status === 'resolved').length
        const falseAlarms = action.payload.filter(i => i.status === 'false_alarm').length
        
        const responseTimes = action.payload.filter(i => i.responseTime).map(i => i.responseTime!)
        const resolutionTimes = action.payload.filter(i => i.resolutionTime).map(i => i.resolutionTime!)
        
        state.stats = {
          total,
          active,
          resolved,
          falseAlarms,
          averageResponseTime: responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0,
          averageResolutionTime: resolutionTimes.length > 0 ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length : 0,
          byType: action.payload.reduce((acc, i) => {
            acc[i.type] = (acc[i.type] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          bySeverity: action.payload.reduce((acc, i) => {
            acc[i.severity] = (acc[i.severity] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          byBranch: action.payload.reduce((acc, i) => {
            acc[i.location.branch] = (acc[i.location.branch] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        }
        
        state.lastUpdate = new Date().toISOString()
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch incidents'
      })
      // Create incident
      .addCase(createIncident.fulfilled, (state, action) => {
        state.incidents.unshift(action.payload)
        if (action.payload.status === 'active') {
          state.activeIncidents.unshift(action.payload)
        }
      })
      // Update incident
      .addCase(updateIncident.fulfilled, (state, action) => {
        const index = state.incidents.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.incidents[index] = { ...state.incidents[index], ...action.payload.updates }
        }
      })
      // Acknowledge incident
      .addCase(acknowledgeIncident.fulfilled, (state, action) => {
        const incident = state.incidents.find(i => i.id === action.payload.id)
        if (incident) {
          incident.status = action.payload.status
          incident.acknowledgedAt = action.payload.acknowledgedAt
          incident.responseTime = Math.floor((new Date(action.payload.acknowledgedAt).getTime() - new Date(incident.occurredAt).getTime()) / 1000)
        }
      })
      // Resolve incident
      .addCase(resolveIncident.fulfilled, (state, action) => {
        const incident = state.incidents.find(i => i.id === action.payload.id)
        if (incident) {
          incident.status = action.payload.status
          incident.resolvedAt = action.payload.resolvedAt
          if (incident.acknowledgedAt) {
            incident.resolutionTime = Math.floor((new Date(action.payload.resolvedAt).getTime() - new Date(incident.acknowledgedAt).getTime()) / 1000)
          }
          if (action.payload.notes) {
            incident.notes.push(`${new Date().toLocaleTimeString()}: ${action.payload.notes}`)
          }
          
          // Remove from active incidents
          state.activeIncidents = state.activeIncidents.filter(i => i.id !== action.payload.id)
        }
      })
  },
})

export const {
  setSelectedIncident,
  updateFilters,
  clearFilters,
  addIncidentNote,
  toggleRealTime,
  clearError
} = incidentSlice.actions

export default incidentSlice.reducer
