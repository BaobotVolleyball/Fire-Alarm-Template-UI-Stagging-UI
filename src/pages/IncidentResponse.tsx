import React, { useMemo, useState } from "react";
import { Flame, ShieldAlert, AlertTriangle, MapPin, List, Search, Clock, Phone, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// BRAND TONES: white • deep blue • red
// Tailwind palette refs: slate / blue-900 / red-600 / indigo-600

// ---------------- Types ----------------
type Member = { name: string; phone: string; pttId: string; role: string };
type IncidentType = "Cháy" | "An ninh" | "SOS" | "Kỹ thuật";
type IncidentStatus = "Cảnh báo Khẩn cấp" | "Đang xử lý" | "Đã xử lý";

type Incident = {
  id: string;
  branch: string;
  address: string;
  type: IncidentType;
  priority: 1 | 2 | 3;
  status: IncidentStatus;
  time: string; // for demo
  members: Member[];
  scenario?: "Sensor" | "SOS"; // legacy field for context; not used for filtering
};

// ---------------- Mock Data ----------------
const incidents: Incident[] = [
  {
    id: "PNJ.FIRE.001",
    branch: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    type: "Cháy",
    priority: 1,
    status: "Cảnh báo Khẩn cấp",
    time: "2025-08-24 10:45",
    members: [
      { name: "Đội trưởng A", phone: "0901234567", pttId: "PTT-101", role: "Chỉ huy" },
      { name: "Kỹ thuật B", phone: "0902223344", pttId: "PTT-102", role: "Kỹ thuật" },
      { name: "Bảo vệ C", phone: "0905556677", pttId: "PTT-103", role: "Bảo vệ" },
      { name: "Y tế D", phone: "0908889991", pttId: "PTT-104", role: "Nhân viên" },
    ],
  },
  {
    id: "PNJ.SECU.001",
    branch: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    type: "An ninh",
    priority: 2,
    status: "Đã xử lý",
    time: "2025-08-24 09:05",
    scenario: "Sensor", // cửa bị mở bất thường
    members: [{ name: "Bảo vệ G", phone: "0901112233", pttId: "PTT-301", role: "Bảo vệ" }],
  },
  {
    id: "PNJ.SECU.002",
    branch: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    type: "An ninh",
    priority: 1,
    status: "Đang xử lý",
    time: "2025-08-24 10:51",
    scenario: "Sensor",
    members: [
      { name: "Bảo vệ H", phone: "0912345678", pttId: "PTT-302", role: "Bảo vệ" },
      { name: "Chỉ huy I", phone: "0934567890", pttId: "PTT-303", role: "Chỉ huy" },
      { name: "Hỗ trợ J", phone: "0977777777", pttId: "PTT-304", role: "Nhân viên" },
      { name: "Hỗ trợ K", phone: "0966666666", pttId: "PTT-305", role: "Nhân viên" },
    ],
  },
  {
    id: "PNJ.SOS.001",
    branch: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    type: "SOS", // SOS là MỘT LOẠI SỰ CỐ RIÊNG
    priority: 1,
    status: "Cảnh báo Khẩn cấp",
    time: "2025-08-24 11:02",
    scenario: "SOS", // nguồn phát: nút bấm SOS
    members: [
      { name: "Bảo vệ P", phone: "0900000001", pttId: "PTT-401", role: "Bảo vệ" },
      { name: "Chỉ huy Q", phone: "0900000002", pttId: "PTT-402", role: "Chỉ huy" },
    ],
  },
  {
    id: "PNJ.FIRE.002",
    branch: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    type: "Cháy",
    priority: 1,
    status: "Đang xử lý",
    time: "2025-08-24 11:10",
    members: [
      { name: "Đội trưởng L", phone: "0909090901", pttId: "PTT-401", role: "Chỉ huy" },
      { name: "Kỹ thuật M", phone: "0909090902", pttId: "PTT-402", role: "Kỹ thuật" },
      { name: "Bảo vệ N", phone: "0909090903", pttId: "PTT-403", role: "Bảo vệ" },
    ],
  },
  // (Tuỳ chọn) Một case Kỹ thuật để đảm bảo đã bị loại khỏi tab này
  {
    id: "PNJ.TECH.001",
    branch: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    type: "Kỹ thuật",
    priority: 2,
    status: "Đang xử lý",
    time: "2025-08-24 10:32",
    members: [{ name: "Kỹ thuật E", phone: "0907778899", pttId: "PTT-201", role: "Kỹ thuật" }],
  },
];

// ---------------- Meta ----------------
const typeMeta: Record<string, { icon: any; color: string; bg: string }> = {
  "Cháy": { icon: Flame, color: "text-red-600", bg: "bg-red-50" },
  "An ninh": { icon: ShieldAlert, color: "text-blue-600", bg: "bg-blue-50" },
  "SOS": { icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
};

const statusMeta: Record<IncidentStatus, { color: string; bg: string }> = {
  "Cảnh báo Khẩn cấp": { color: "text-red-700", bg: "bg-red-100" },
  "Đang xử lý": { color: "text-blue-700", bg: "bg-blue-100" },
  "Đã xử lý": { color: "text-emerald-700", bg: "bg-emerald-100" },
};

// ---------------- Main Component ----------------
export default function IncidentResponse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<IncidentType | "Tất cả">("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | "Tất cả">("Tất cả");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Filter incidents (exclude "Kỹ thuật" type)
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter(inc => inc.type !== "Kỹ thuật") // Exclude technical incidents
      .filter(inc => {
        const matchesSearch = inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inc.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inc.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "Tất cả" || inc.type === selectedType;
        const matchesStatus = selectedStatus === "Tất cả" || inc.status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        // Sort by priority (1 = highest), then by time (newest first)
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
  }, [searchTerm, selectedType, selectedStatus]);

  const stats = useMemo(() => {
    const total = filteredIncidents.length;
    const urgent = filteredIncidents.filter(inc => inc.status === "Cảnh báo Khẩn cấp").length;
    const processing = filteredIncidents.filter(inc => inc.status === "Đang xử lý").length;
    const resolved = filteredIncidents.filter(inc => inc.status === "Đã xử lý").length;
    return { total, urgent, processing, resolved };
  }, [filteredIncidents]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Ứng cứu Sự cố
          </h1>
          <p className="text-slate-600">
            Điều phối sự cố Cháy, An ninh và SOS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            Danh sách
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="h-4 w-4 mr-2" />
            Bản đồ
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sự cố</CardTitle>
            <AlertTriangle className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khẩn cấp</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xử lý</CardTitle>
            <Clock className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo ID, chi nhánh, địa chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as IncidentType | "Tất cả")}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
            >
              <option value="Tất cả">Tất cả loại</option>
              <option value="Cháy">Cháy</option>
              <option value="An ninh">An ninh</option>
              <option value="SOS">SOS</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as IncidentStatus | "Tất cả")}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Cảnh báo Khẩn cấp">Khẩn cấp</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã xử lý">Đã xử lý</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const meta = typeMeta[incident.type];
          const statusStyle = statusMeta[incident.status];
          const Icon = meta.icon;

          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${meta.bg}`}>
                    <Icon className={`h-6 w-6 ${meta.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{incident.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.color}`}>
                        {incident.status}
                      </span>
                      <span className="text-xs text-slate-500">Mức {incident.priority}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {incident.branch}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {incident.time}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{incident.address}</p>
                    <div className="flex flex-wrap gap-2">
                      {incident.members.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-md text-xs">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-slate-500">({member.role})</span>
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-500">{member.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Chi tiết
                  </Button>
                  {incident.status !== "Đã xử lý" && (
                    <Button size="sm">
                      Cập nhật
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Không có sự cố nào</h3>
          <p className="text-slate-600">Không tìm thấy sự cố phù hợp với bộ lọc hiện tại.</p>
        </div>
      )}
    </div>
  );
}
