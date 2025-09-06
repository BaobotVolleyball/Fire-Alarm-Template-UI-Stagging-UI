import React from 'react'
import { Link } from 'react-router-dom'
import { 
  LayoutGrid, 
  Flame, 
  Wrench, 
  BarChart3, 
  AlertTriangle,
  Activity,
  Users,
  Building2,
  Shield,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const stats = [
  {
    title: 'Tổng thiết bị',
    value: '156',
    change: '+12%',
    changeType: 'positive' as const,
    icon: LayoutGrid,
    color: 'blue'
  },
  {
    title: 'Sự cố đang xử lý',
    value: '3',
    change: '-2',
    changeType: 'positive' as const,
    icon: AlertTriangle,
    color: 'amber'
  },
  {
    title: 'Thiết bị offline',
    value: '2',
    change: '+1',
    changeType: 'negative' as const,
    icon: Activity,
    color: 'red'
  },
  {
    title: 'Chi nhánh hoạt động',
    value: '8/8',
    change: '100%',
    changeType: 'positive' as const,
    icon: Building2,
    color: 'emerald'
  }
]

const quickActions = [
  {
    title: 'Quản lý Thiết bị',
    description: 'Giám sát thiết bị PCCC & An ninh',
    icon: LayoutGrid,
    href: '/thiet-bi',
    color: 'bg-blue-500'
  },
  {
    title: 'Ứng cứu Sự cố',
    description: 'Xử lý sự cố Cháy, An ninh, SOS',
    icon: Flame,
    href: '/ung-cuu-su-co',
    color: 'bg-red-500'
  },
  {
    title: 'Ứng cứu Kỹ thuật',
    description: 'Khắc phục sự cố kỹ thuật',
    icon: Wrench,
    href: '/ung-cuu-ky-thuat',
    color: 'bg-amber-500'
  },
  {
    title: 'Thống kê & Báo cáo',
    description: 'Phân tích dữ liệu sự cố',
    icon: BarChart3,
    href: '/thong-ke-su-co',
    color: 'bg-emerald-500'
  }
]

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Tổng quan Hệ thống
        </h1>
        <p className="text-slate-600">
          Giám sát và quản lý hệ thống PCCC & An ninh theo Nghị định 105/2025/NĐ-CP
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change} so với tháng trước
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Truy cập nhanh
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-white mb-2`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-slate-50">
                    <Link to={action.href}>
                      Truy cập
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sự cố gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
              <div>
                <p className="font-medium text-red-900">PNJ.FIRE.001</p>
                <p className="text-sm text-red-600">Chi nhánh A - Cảnh báo cháy</p>
              </div>
              <span className="text-xs text-red-500">10:45</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <div>
                <p className="font-medium text-blue-900">PNJ.SECU.002</p>
                <p className="text-sm text-blue-600">Chi nhánh A - Cảnh báo an ninh</p>
              </div>
              <span className="text-xs text-blue-500">10:51</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
              <div>
                <p className="font-medium text-amber-900">PNJ.TECH.001</p>
                <p className="text-sm text-amber-600">Chi nhánh A - Sự cố kỹ thuật</p>
              </div>
              <span className="text-xs text-amber-500">10:32</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              Trạng thái hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Gateway kết nối</span>
              <span className="text-sm font-medium text-emerald-600">8/8 Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Camera hoạt động</span>
              <span className="text-sm font-medium text-emerald-600">24/24 Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Cảm biến PCCC</span>
              <span className="text-sm font-medium text-emerald-600">156/156 Normal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Hệ thống bơm</span>
              <span className="text-sm font-medium text-emerald-600">Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
