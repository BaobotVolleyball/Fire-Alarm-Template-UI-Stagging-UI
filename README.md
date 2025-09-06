# Fire Alarm & Security Management System

Hệ thống quản lý báo cháy và an ninh đa tenant với kiến trúc SaaS hiện đại, tuân thủ Nghị định 105/2025/ND-CP về an toàn PCCC tại Việt Nam.

## 🚀 Tính năng chính

### 1. **Tác chiến ứng cứu**
- **Ứng cứu Sự cố**: Điều phối sự cố cháy, an ninh, SOS với dữ liệu real-time
- **Ứng cứu Kỹ thuật**: Xử lý sự cố kỹ thuật thiết bị với hệ thống ticketing
- **Chi tiết Sự cố**: Màn hình giám sát chi tiết với camera grid và PTT

### 2. **Tài sản thiết bị**
- **Dashboard Admin Tenant**: Tổng quan toàn tổ chức
- **Dashboard Admin Department**: Quản lý theo chi nhánh
- **Console Plane**: Giám sát chi tiết Gateway Architecture (GW-A & GW-M)

### 3. **Hồ sơ pháp lý**
- **Thống kê & Báo cáo**: Tuân thủ ND105/2025 với báo cáo tự động

### 4. **Tài khoản**
- **RBAC**: 5 loại người dùng với phân quyền chi tiết
- **Multi-tenant**: Hỗ trợ nhiều tổ chức độc lập

## 🏗️ Kiến trúc hệ thống

### **Frontend Stack**
- **React 18** + **TypeScript** - UI framework hiện đại
- **Vite** - Build tool nhanh chóng
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library mượt mà
- **Redux Toolkit** - State management
- **React Router** - Client-side routing

### **Gateway Architecture**
- **GW-A (Gateway Alarm)**: Quản lý tín hiệu báo cháy, zones, input/output
- **GW-M (Gateway Metrics)**: Giám sát UPS, quạt khói, bơm nước, cửa khẩn cấp

## 🚀 Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Ứng dụng sẽ chạy tại http://localhost:3333
```

## 🧪 Testing

Mở Developer Console và chạy:
```javascript
// Chạy tất cả test cases
fireAlarmTests.runAllTests()

// Test performance
performanceMonitor.logUsage()
```

**Developed by Viotech Corporation** 🔥🚨
