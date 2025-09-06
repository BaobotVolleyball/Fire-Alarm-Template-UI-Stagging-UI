import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Activity,
  Gauge,
  MapPin,
  Search,
  Wrench,
  Fan as FanIcon,
  Waves,
  Camera,
  ChevronLeft,
  Building2,
  RotateCcw,
  Power,
  RefreshCcw,
  Phone,
  Video,
  ClipboardList,
  Ticket as TicketIcon,
  Clock,
  Info,
  ExternalLink,
  Zap,
  Droplets,
  Wind,
  DoorOpen,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// === Technical Response Screen ===
// Tích hợp từ ứng_cứu_kỹ_thuật.jsx với TypeScript và modern React patterns

// ---------- Types ----------
interface Gateway {
  id: string;
  type: "GW-A" | "GW-M";
  name: string;
  status: "Connected" | "Disconnected";
  lastSeen: string;
}

interface Device {
  id: string;
  name: string;
  type: "FACP" | "UPS" | "Fan" | "Pump" | "Door" | "Generator";
  status: "Online" | "Offline" | "Warning" | "Error";
  gateway: string;
  metrics?: Record<string, number>;
  issues: string[];
  lastUpdate: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  gateways: Gateway[];
  devices: Device[];
  totalIssues: number;
  offlineDevices: number;
  warningDevices: number;
  riskScore: number;
}

// ---------- Mock Data ----------
const branches: Branch[] = [
  {
    id: "BR001",
    name: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    gateways: [
      { id: "GWA001", type: "GW-A", name: "Gateway Alarm A", status: "Connected", lastSeen: "2025-08-24 14:30" },
      { id: "GWM001", type: "GW-M", name: "Gateway Metrics A", status: "Disconnected", lastSeen: "2025-08-24 13:45" }
    ],
    devices: [
      {
        id: "FACP001", name: "FACP Chính", type: "FACP", status: "Warning", gateway: "GWA001",
        metrics: { ACVoltage: 195, DCVoltage: 25 },
        issues: ["Điện áp AC quá thấp"],
        lastUpdate: "2025-08-24 14:30"
      },
      {
        id: "UPS001", name: "UPS Phòng điều khiển", type: "UPS", status: "Online", gateway: "GWM001",
        metrics: { UPSVoltage: 220, UPSCurrent: 5.2 },
        issues: [],
        lastUpdate: "2025-08-24 13:45"
      },
      {
        id: "FAN001", name: "Quạt thông gió T1", type: "Fan", status: "Error", gateway: "GWM001",
        metrics: { FANVoltage: 180, FANCurrent: 0 },
        issues: ["Điện áp quá thấp", "Không có dòng điện"],
        lastUpdate: "2025-08-24 13:45"
      }
    ],
    totalIssues: 3,
    offlineDevices: 1,
    warningDevices: 1,
    riskScore: 85
  },
  {
    id: "BR002",
    name: "Chi nhánh B", 
    address: "Tòa nhà B, 456 Đường ABC",
    gateways: [
      { id: "GWA002", type: "GW-A", name: "Gateway Alarm B", status: "Connected", lastSeen: "2025-08-24 14:32" },
      { id: "GWM002", type: "GW-M", name: "Gateway Metrics B", status: "Connected", lastSeen: "2025-08-24 14:32" }
    ],
    devices: [
      {
        id: "FACP002", name: "FACP Chính", type: "FACP", status: "Online", gateway: "GWA002",
        metrics: { ACVoltage: 225, DCVoltage: 24 },
        issues: [],
        lastUpdate: "2025-08-24 14:32"
      },
      {
        id: "PUMP002", name: "Máy bơm PCCC", type: "Pump", status: "Warning", gateway: "GWM002",
        metrics: { PUMPVoltage: 215, PUMPCurrent: 8.5, WaterFlow: 45, PipePressure: 6.2 },
        issues: ["Áp suất ống thấp"],
        lastUpdate: "2025-08-24 14:32"
      }
    ],
    totalIssues: 1,
    offlineDevices: 0,
    warningDevices: 1,
    riskScore: 72
  }
];

// ---------- Components ----------

interface BranchOverviewCardProps {
  branch: Branch;
  onViewDetails: (branchId: string) => void;
}

function BranchOverviewCard({ branch, onViewDetails }: BranchOverviewCardProps) {
  const getRiskColor = (score: number) => {
    if (score >= 90) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 75) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  const connectedGateways = branch.gateways.filter(gw => gw.status === "Connected").length;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{branch.name}</h3>
          <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {branch.address}
          </p>
        </div>
        <div className={`px-2 py-1 rounded border text-xs font-medium ${getRiskColor(branch.riskScore)}`}>
          Risk: {branch.riskScore}
        </div>
      </div>

      {/* Gateway Status */}
      <div className="mb-4">
        <div className="text-sm text-slate-600 mb-2">Gateway Status</div>
        <div className="flex gap-2">
          {branch.gateways.map(gw => (
            <div key={gw.id} className="flex items-center gap-1 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                gw.status === "Connected" ? "bg-emerald-500" : "bg-red-500"
              }`}></div>
              <span>{gw.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Issues Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-red-600">{branch.totalIssues}</div>
          <div className="text-xs text-slate-500">Issues</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-slate-600">{branch.offlineDevices}</div>
          <div className="text-xs text-slate-500">Offline</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-orange-600">{branch.warningDevices}</div>
          <div className="text-xs text-slate-500">Warning</div>
        </div>
      </div>

      <Button 
        size="sm" 
        variant="outline" 
        className="w-full"
        onClick={() => onViewDetails(branch.id)}
      >
        <Wrench className="h-4 w-4 mr-2" />
        Xem chi tiết kỹ thuật
      </Button>
    </Card>
  );
}

interface DeviceCardProps {
  device: Device;
  onCreateTicket: (deviceId: string) => void;
}

function DeviceCard({ device, onCreateTicket }: DeviceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "text-emerald-600 bg-emerald-50";
      case "Warning": return "text-orange-600 bg-orange-50";
      case "Error": return "text-red-600 bg-red-50";
      case "Offline": return "text-slate-600 bg-slate-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "FACP": return <AlertTriangle className="h-5 w-5" />;
      case "UPS": return <Zap className="h-5 w-5" />;
      case "Fan": return <FanIcon className="h-5 w-5" />;
      case "Pump": return <Droplets className="h-5 w-5" />;
      case "Door": return <DoorOpen className="h-5 w-5" />;
      case "Generator": return <Power className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getDeviceIcon(device.type)}
          <div>
            <h4 className="font-medium text-slate-900">{device.name}</h4>
            <p className="text-xs text-slate-500">{device.type} • {device.id}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(device.status)}`}>
          {device.status}
        </div>
      </div>

      {/* Metrics */}
      {device.metrics && Object.keys(device.metrics).length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-slate-600 mb-1">Metrics</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(device.metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-500">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {device.issues.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-slate-600 mb-1">Issues</div>
          <div className="space-y-1">
            {device.issues.map((issue, index) => (
              <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {issue}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Cập nhật: {device.lastUpdate}</span>
        {device.issues.length > 0 && (
          <Button 
            size="xs" 
            variant="outline"
            onClick={() => onCreateTicket(device.id)}
          >
            <TicketIcon className="h-3 w-3 mr-1" />
            Tạo ticket
          </Button>
        )}
      </div>
    </Card>
  );
}

export function TechnicalResponse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "details">("overview");

  const filteredBranches = useMemo(() => {
    return branches.filter(branch => 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedBranchData = useMemo(() => {
    return branches.find(b => b.id === selectedBranch);
  }, [selectedBranch]);

  const handleViewDetails = (branchId: string) => {
    setSelectedBranch(branchId);
    setViewMode("details");
  };

  const handleCreateTicket = (deviceId: string) => {
    // Placeholder for ticket creation
    console.log("Creating ticket for device:", deviceId);
  };

  const totalStats = useMemo(() => {
    return {
      totalIssues: branches.reduce((sum, b) => sum + b.totalIssues, 0),
      offlineDevices: branches.reduce((sum, b) => sum + b.offlineDevices, 0),
      warningDevices: branches.reduce((sum, b) => sum + b.warningDevices, 0),
      connectedGateways: branches.reduce((sum, b) => sum + b.gateways.filter(gw => gw.status === "Connected").length, 0),
      totalGateways: branches.reduce((sum, b) => sum + b.gateways.length, 0)
    };
  }, []);

  if (viewMode === "details" && selectedBranchData) {
    return (
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewMode("overview")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Kỹ thuật: {selectedBranchData.name}
                </h1>
                <p className="text-slate-600">{selectedBranchData.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {/* Gateway Status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Gateway Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedBranchData.gateways.map(gateway => (
              <div key={gateway.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-slate-600" />
                  <div>
                    <div className="font-medium">{gateway.name}</div>
                    <div className="text-sm text-slate-500">{gateway.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    gateway.status === "Connected" ? "bg-emerald-500" : "bg-red-500"
                  }`}></div>
                  <span className="text-sm">{gateway.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Devices */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Thiết bị ({selectedBranchData.devices.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBranchData.devices.map(device => (
              <DeviceCard 
                key={device.id} 
                device={device} 
                onCreateTicket={handleCreateTicket}
              />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Ứng cứu Kỹ thuật
            </h1>
            <p className="text-slate-600">
              Giám sát và xử lý sự cố kỹ thuật thiết bị
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tổng quan Hệ thống</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalStats.totalIssues}</div>
            <div className="text-sm text-slate-600">Tổng Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-600">{totalStats.offlineDevices}</div>
            <div className="text-sm text-slate-600">Offline</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{totalStats.warningDevices}</div>
            <div className="text-sm text-slate-600">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{totalStats.connectedGateways}</div>
            <div className="text-sm text-slate-600">GW Connected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{branches.length}</div>
            <div className="text-sm text-slate-600">Chi nhánh</div>
          </div>
        </div>
      </Card>

      {/* Branch Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Chi nhánh ({branches.length})
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm chi nhánh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <BranchOverviewCard 
              key={branch.id} 
              branch={branch} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Không tìm thấy chi nhánh phù hợp</p>
          </div>
        )}
      </Card>
    </div>
  );
}
