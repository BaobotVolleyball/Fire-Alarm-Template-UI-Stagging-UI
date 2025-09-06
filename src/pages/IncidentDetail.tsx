import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Camera, 
  Mic, 
  Volume2,
  AlertTriangle,
  Activity,
  Power,
  Zap,
  Droplets,
  Wind,
  Shield,
  DoorOpen,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// === Incident Detail Screen (Tenant) ===
// Tích hợp từ chi_tiết_sự_cố.jsx với TypeScript và modern React patterns

// ---------- Mock Data ----------
const mockIncident = {
  id: "PNJ.FIRE.001",
  site: {
    name: "Chi nhánh A",
    address: "Tòa nhà A, 123 Đường XYZ",
    lat: 10.771,
    lng: 106.698,
  },
  type: "Cháy" as const,
  priority: 1,
  status: "Cảnh báo",
  occurredAt: "2025-08-24T10:45:00+07:00",
  commander: { name: "Nguyễn Văn A" },
  operator: { name: "Nguyễn Văn B" },
  sosButton: { pressed: false },
  security: { doorSensor: { violated: false } },
};

const cameraList = Array.from({ length: 20 }).map((_, i) => ({
  id: `CAM-${String(i + 1).padStart(2, "0")}`,
  name: `Camera ${i + 1}`,
  location: [
    "Sảnh chính", "Hành lang T5", "Kho A", "Thang thoát hiểm", "Bãi xe",
    "Quầy thu ngân", "Phòng bơm", "Máy phát", "Mái che", "Cửa chính",
    "Khu A1", "Khu A2", "Khu A3", "Khu A4", "Lối ra 1", "Lối ra 2",
    "Phòng điều khiển", "Kho B", "Sân thượng", "Tầng hầm"
  ][i % 20],
  status: Math.random() > 0.8 ? "offline" : "online",
  recording: Math.random() > 0.5,
}));

// ---------- Components ----------

interface CameraTileProps {
  camera: typeof cameraList[0];
  onCapture: (cameraId: string) => void;
}

function CameraTile({ camera, onCapture }: CameraTileProps) {
  return (
    <Card className="relative overflow-hidden bg-slate-900 aspect-video">
      {/* Camera Feed Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {camera.status === "offline" ? (
          <div className="text-center text-slate-400">
            <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Offline</div>
          </div>
        ) : (
          <div className="text-center text-slate-300">
            <div className="text-sm mb-1">{camera.name}</div>
            <div className="text-xs text-slate-400">{camera.location}</div>
            {camera.recording && (
              <div className="flex items-center justify-center mt-2 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                <span className="text-xs">REC</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        <Button
          size="xs"
          variant="secondary"
          onClick={() => onCapture(camera.id)}
          disabled={camera.status === "offline"}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          <Camera className="h-3 w-3" />
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-2 left-2">
        <div className={`w-2 h-2 rounded-full ${
          camera.status === "online" ? "bg-emerald-500" : "bg-red-500"
        }`}></div>
      </div>
    </Card>
  );
}

interface FACPZoneProps {
  zone: number;
  status: "normal" | "alarm" | "fault";
  label: string;
}

function FACPZone({ zone, status, label }: FACPZoneProps) {
  const statusColors = {
    normal: "bg-emerald-500",
    alarm: "bg-red-500 animate-pulse",
    fault: "bg-yellow-500"
  };

  return (
    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
        <span className="text-sm font-medium">Zone {zone}</span>
      </div>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}

export function IncidentDetail() {
  const [captureLog, setCaptureLog] = useState<Array<{id: string, camera: string, time: string}>>([]);
  
  const handleCapture = (cameraId: string) => {
    const camera = cameraList.find(c => c.id === cameraId);
    if (camera) {
      setCaptureLog(prev => [{
        id: Date.now().toString(),
        camera: camera.name,
        time: new Date().toLocaleTimeString('vi-VN')
      }, ...prev].slice(0, 10));
    }
  };

  const facpZones = [
    { zone: 1, status: "alarm" as const, label: "Sảnh chính" },
    { zone: 2, status: "normal" as const, label: "Hành lang T5" },
    { zone: 3, status: "normal" as const, label: "Kho A" },
    { zone: 4, status: "fault" as const, label: "Thang thoát hiểm" },
    { zone: 5, status: "normal" as const, label: "Bãi xe" },
    { zone: 6, status: "normal" as const, label: "Quầy thu ngân" },
    { zone: 7, status: "normal" as const, label: "Phòng bơm" },
    { zone: 8, status: "normal" as const, label: "Máy phát" },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Chi tiết Sự cố: {mockIncident.id}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {mockIncident.site.address}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(mockIncident.occurredAt).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {mockIncident.type}
            </div>
            <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              Ưu tiên {mockIncident.priority}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Grid - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Camera Giám sát ({cameraList.filter(c => c.status === "online").length}/{cameraList.length} Online)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {cameraList.slice(0, 12).map((camera) => (
                <CameraTile 
                  key={camera.id} 
                  camera={camera} 
                  onCapture={handleCapture}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Control Panel - Takes 1 column */}
        <div className="space-y-6">
          {/* FACP Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              FACP - 8 Zone
            </h3>
            <div className="space-y-2">
              {facpZones.map((zone) => (
                <FACPZone key={zone.zone} {...zone} />
              ))}
            </div>
          </Card>

          {/* Capture Log */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Nhật ký Chụp ảnh
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {captureLog.length === 0 ? (
                <p className="text-sm text-slate-500">Chưa có ảnh nào được chụp</p>
              ) : (
                captureLog.map((log) => (
                  <div key={log.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                    <span>{log.camera}</span>
                    <span className="text-slate-500">{log.time}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
