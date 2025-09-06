import React, { useMemo, useState } from "react";
import {
  LayoutGrid,
  Building2,
  Server,
  Gauge,
  Camera as CameraIcon,
  Radio,
  Settings,
  MapPin,
  Activity,
  AlertTriangle,
  Wifi,
  WifiOff,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Filter,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// === Device Management Screen ===
// Tích hợp từ tenant_quản_ly_thiết_bị_react_ui.jsx với TypeScript và modern React patterns

// ---------- Types ----------
type PageKey = "dashboard" | "branches" | "gwa" | "gwm" | "camera" | "radio" | "settings";

interface Branch {
  id: string;
  name: string;
  address: string;
  status: "online" | "offline" | "warning";
  deviceCount: number;
  lastUpdate: string;
  coordinates?: { lat: number; lng: number };
}

interface Device {
  id: string;
  name: string;
  type: "GW-A" | "GW-M" | "Camera" | "PTT" | "Sensor";
  status: "online" | "offline" | "warning" | "error";
  branch: string;
  lastSeen: string;
  metrics?: Record<string, any>;
}

// ---------- Mock Data ----------
const branches: Branch[] = [
  {
    id: "BR001",
    name: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ, Q1, TP.HCM",
    status: "online",
    deviceCount: 24,
    lastUpdate: "2025-08-24 14:30",
    coordinates: { lat: 10.771, lng: 106.698 }
  },
  {
    id: "BR002",
    name: "Chi nhánh B",
    address: "Tòa nhà B, 456 Đường ABC, Q3, TP.HCM",
    status: "warning",
    deviceCount: 18,
    lastUpdate: "2025-08-24 14:25",
    coordinates: { lat: 10.785, lng: 106.705 }
  },
  {
    id: "BR003",
    name: "Chi nhánh C",
    address: "Tòa nhà C, 789 Đường DEF, Q7, TP.HCM",
    status: "offline",
    deviceCount: 31,
    lastUpdate: "2025-08-24 13:45",
    coordinates: { lat: 10.732, lng: 106.722 }
  }
];

const devices: Device[] = [
  {
    id: "GWA001",
    name: "Gateway Alarm A",
    type: "GW-A",
    status: "online",
    branch: "BR001",
    lastSeen: "2025-08-24 14:30"
  },
  {
    id: "GWM001",
    name: "Gateway Metrics A",
    type: "GW-M",
    status: "warning",
    branch: "BR001",
    lastSeen: "2025-08-24 14:28"
  },
  {
    id: "CAM001",
    name: "Camera Sảnh chính",
    type: "Camera",
    status: "online",
    branch: "BR001",
    lastSeen: "2025-08-24 14:30"
  },
  {
    id: "PTT001",
    name: "PTT Device 001",
    type: "PTT",
    status: "offline",
    branch: "BR002",
    lastSeen: "2025-08-24 13:15"
  }
];

// ---------- Components ----------

interface SidebarProps {
  active: PageKey;
  onChange: (page: PageKey) => void;
}

function Sidebar({ active, onChange }: SidebarProps) {
  const items = [
    { key: "dashboard", label: "Tổng quan Thiết bị", icon: <LayoutGrid className="h-4 w-4" /> },
    { key: "branches", label: "Chi nhánh", icon: <Building2 className="h-4 w-4" /> },
    { key: "gwa", label: "Gateway Báo động (GW‑A)", icon: <Server className="h-4 w-4" /> },
    { key: "gwm", label: "Gateway Kỹ thuật (GW‑M)", icon: <Gauge className="h-4 w-4" /> },
    { key: "camera", label: "Quản lý Camera", icon: <CameraIcon className="h-4 w-4" /> },
    { key: "radio", label: "Đàm thoại 4G (PTT)", icon: <Radio className="h-4 w-4" /> },
    { key: "settings", label: "Cấu hình & Cài đặt", icon: <Settings className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="w-72 bg-white border-r border-slate-200 h-full">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">Quản lý Thiết bị</h2>
        <p className="text-sm text-slate-600">PCCC & An ninh</p>
      </div>
      <nav className="p-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === item.key
                ? "bg-blue-50 text-blue-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

interface BranchCardProps {
  branch: Branch;
  onOpenBranch: (branchId: string) => void;
  onViewDevices: (branchId: string) => void;
}

function BranchCard({ branch, onOpenBranch, onViewDevices }: BranchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-emerald-600 bg-emerald-50";
      case "warning": return "text-orange-600 bg-orange-50";
      case "offline": return "text-red-600 bg-red-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <Wifi className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "offline": return <WifiOff className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

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
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(branch.status)}`}>
          {getStatusIcon(branch.status)}
          {branch.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{branch.deviceCount}</div>
          <div className="text-xs text-slate-500">Thiết bị</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-600">{branch.lastUpdate}</div>
          <div className="text-xs text-slate-500">Cập nhật cuối</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onViewDevices(branch.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Xem thiết bị
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onOpenBranch(branch.id)}
        >
          Quản lý
        </Button>
      </div>
    </Card>
  );
}

export default function DeviceManagement() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const filteredBranches = useMemo(() => {
    return branches.filter(branch =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleOpenBranch = (branchId: string) => {
    setSelectedBranch(branchId);
    // Navigate to branch details
  };

  const handleViewDevices = (branchId: string) => {
    setSelectedBranch(branchId);
    // Navigate to device list
  };

  const totalStats = useMemo(() => {
    return {
      totalBranches: branches.length,
      onlineBranches: branches.filter(b => b.status === "online").length,
      totalDevices: branches.reduce((sum, b) => sum + b.deviceCount, 0),
      onlineDevices: Math.floor(branches.reduce((sum, b) => sum + b.deviceCount, 0) * 0.85) // Mock calculation
    };
  }, []);

  if (activePage === "branches") {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar active={activePage} onChange={setActivePage} />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Quản lý Chi nhánh
                  </h1>
                  <p className="text-slate-600">
                    Tổng quan và quản lý các chi nhánh trong hệ thống
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm chi nhánh
                  </Button>
                </div>
              </div>
            </div>

            {/* Search */}
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm chi nhánh theo tên hoặc địa chỉ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </Card>

            {/* Branch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onOpenBranch={handleOpenBranch}
                  onViewDevices={handleViewDevices}
                />
              ))}
            </div>

            {filteredBranches.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Không tìm thấy chi nhánh phù hợp</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default dashboard view
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar active={activePage} onChange={setActivePage} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Tổng quan Thiết bị
                </h1>
                <p className="text-slate-600">
                  Giám sát thiết bị PCCC & An ninh theo thời gian thực
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Chi nhánh</p>
                  <p className="text-2xl font-bold text-slate-900">{totalStats.totalBranches}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Chi nhánh Online</p>
                  <p className="text-2xl font-bold text-emerald-600">{totalStats.onlineBranches}</p>
                </div>
                <Wifi className="h-8 w-8 text-emerald-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Thiết bị</p>
                  <p className="text-2xl font-bold text-slate-900">{totalStats.totalDevices}</p>
                </div>
                <Server className="h-8 w-8 text-slate-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Thiết bị Online</p>
                  <p className="text-2xl font-bold text-emerald-600">{totalStats.onlineDevices}</p>
                </div>
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Truy cập nhanh</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { key: "branches", label: "Chi nhánh", icon: <Building2 className="h-6 w-6" /> },
                { key: "gwa", label: "Gateway Alarm", icon: <Server className="h-6 w-6" /> },
                { key: "gwm", label: "Gateway Metrics", icon: <Gauge className="h-6 w-6" /> },
                { key: "camera", label: "Camera", icon: <CameraIcon className="h-6 w-6" /> },
                { key: "radio", label: "PTT Radio", icon: <Radio className="h-6 w-6" /> },
                { key: "settings", label: "Cài đặt", icon: <Settings className="h-6 w-6" /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key as PageKey)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-slate-600">{item.icon}</div>
                  <span className="text-sm font-medium text-slate-900">{item.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Hoạt động gần đây</h2>
            <div className="space-y-3">
              {[
                { time: "14:30", action: "Gateway GWA001 kết nối thành công", status: "success" },
                { time: "14:28", action: "Camera CAM001 bắt đầu ghi hình", status: "info" },
                { time: "14:25", action: "Thiết bị PTT001 mất kết nối", status: "warning" },
                { time: "14:20", action: "Cập nhật firmware cho FACP tại Chi nhánh A", status: "success" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 w-12">{activity.time}</div>
                  <div className="flex-1 text-sm text-slate-700">{activity.action}</div>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === "success" ? "bg-emerald-500" :
                    activity.status === "warning" ? "bg-orange-500" : "bg-blue-500"
                  }`}></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
