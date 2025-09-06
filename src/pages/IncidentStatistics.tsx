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
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// === Incident Statistics Screen ===
// Tích hợp từ thống_kê_sự_cố.jsx với TypeScript và modern React patterns

// ---------- Types ----------
interface Branch {
  id: string;
  name: string;
  address: string;
  riskScore: number;
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  deviceIssues: number;
  lastUpdate: string;
}

interface IncidentSummary {
  type: "Cháy" | "An ninh" | "SOS" | "Kỹ thuật";
  count: number;
  trend: "up" | "down" | "stable";
  percentage: number;
}

// ---------- Mock Data ----------
const branches: Branch[] = [
  {
    id: "BR001",
    name: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    riskScore: 85,
    totalIncidents: 24,
    activeIncidents: 3,
    resolvedIncidents: 21,
    deviceIssues: 2,
    lastUpdate: "2025-08-24 14:30"
  },
  {
    id: "BR002", 
    name: "Chi nhánh B",
    address: "Tòa nhà B, 456 Đường ABC",
    riskScore: 72,
    totalIncidents: 18,
    activeIncidents: 1,
    resolvedIncidents: 17,
    deviceIssues: 1,
    lastUpdate: "2025-08-24 14:25"
  },
  {
    id: "BR003",
    name: "Chi nhánh C", 
    address: "Tòa nhà C, 789 Đường DEF",
    riskScore: 91,
    totalIncidents: 31,
    activeIncidents: 5,
    resolvedIncidents: 26,
    deviceIssues: 4,
    lastUpdate: "2025-08-24 14:20"
  }
];

const incidentSummary: IncidentSummary[] = [
  { type: "Cháy", count: 12, trend: "down", percentage: -15 },
  { type: "An ninh", count: 8, trend: "up", percentage: 23 },
  { type: "SOS", count: 3, trend: "stable", percentage: 0 },
  { type: "Kỹ thuật", count: 18, trend: "up", percentage: 12 }
];

// ---------- Components ----------

interface BranchCardProps {
  branch: Branch;
  onViewDetails: (branchId: string) => void;
}

function BranchCard({ branch, onViewDetails }: BranchCardProps) {
  const getRiskColor = (score: number) => {
    if (score >= 90) return "text-red-600 bg-red-50";
    if (score >= 75) return "text-orange-600 bg-orange-50";
    return "text-emerald-600 bg-emerald-50";
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
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(branch.riskScore)}`}>
          Risk: {branch.riskScore}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{branch.totalIncidents}</div>
          <div className="text-xs text-slate-500">Tổng sự cố</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{branch.activeIncidents}</div>
          <div className="text-xs text-slate-500">Đang xử lý</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-emerald-600">{branch.resolvedIncidents} đã xử lý</span>
          <span className="text-orange-600">{branch.deviceIssues} thiết bị lỗi</span>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onViewDetails(branch.id)}
        >
          Chi tiết
        </Button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          Cập nhật: {branch.lastUpdate}
        </div>
      </div>
    </Card>
  );
}

interface StatCardProps {
  incident: IncidentSummary;
}

function StatCard({ incident }: StatCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Cháy": return "text-red-600 bg-red-50";
      case "An ninh": return "text-blue-600 bg-blue-50";
      case "SOS": return "text-purple-600 bg-purple-50";
      case "Kỹ thuật": return "text-orange-600 bg-orange-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-emerald-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(incident.type)}`}>
          {incident.type}
        </div>
        {getTrendIcon(incident.trend)}
      </div>
      
      <div className="text-3xl font-bold text-slate-900 mb-2">
        {incident.count}
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-600">Tháng này</span>
        {incident.percentage !== 0 && (
          <span className={`font-medium ${
            incident.percentage > 0 ? "text-red-600" : "text-emerald-600"
          }`}>
            {incident.percentage > 0 ? "+" : ""}{incident.percentage}%
          </span>
        )}
      </div>
    </Card>
  );
}

export function IncidentStatistics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const filteredBranches = useMemo(() => {
    return branches.filter(branch => 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalStats = useMemo(() => {
    return {
      totalIncidents: branches.reduce((sum, b) => sum + b.totalIncidents, 0),
      activeIncidents: branches.reduce((sum, b) => sum + b.activeIncidents, 0),
      resolvedIncidents: branches.reduce((sum, b) => sum + b.resolvedIncidents, 0),
      deviceIssues: branches.reduce((sum, b) => sum + b.deviceIssues, 0),
      avgRiskScore: Math.round(branches.reduce((sum, b) => sum + b.riskScore, 0) / branches.length)
    };
  }, []);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Thống kê Sự cố
            </h1>
            <p className="text-slate-600">
              Tổng quan và phân tích sự cố toàn hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
            <Button size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {incidentSummary.map((incident) => (
          <StatCard key={incident.type} incident={incident} />
        ))}
      </div>

      {/* Overall Stats */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tổng quan Hệ thống</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalStats.totalIncidents}</div>
            <div className="text-sm text-slate-600">Tổng sự cố</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalStats.activeIncidents}</div>
            <div className="text-sm text-slate-600">Đang xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{totalStats.resolvedIncidents}</div>
            <div className="text-sm text-slate-600">Đã xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{totalStats.deviceIssues}</div>
            <div className="text-sm text-slate-600">Thiết bị lỗi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalStats.avgRiskScore}</div>
            <div className="text-sm text-slate-600">Risk TB</div>
          </div>
        </div>
      </Card>

      {/* Branch Statistics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Thống kê theo Chi nhánh
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
            <BranchCard 
              key={branch.id} 
              branch={branch} 
              onViewDetails={setSelectedBranch}
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
