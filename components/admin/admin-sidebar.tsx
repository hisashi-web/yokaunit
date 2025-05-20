"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  PenToolIcon as Tool,
  MessageSquare,
  Users,
  Settings,
  FileText,
  BarChart3,
  Bell,
} from "lucide-react"

interface AdminSidebarProps {
  activePage: string
}

export function AdminSidebar({ activePage }: AdminSidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "ダッシュボード",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: "/admin/dashboard",
    },
    {
      id: "tools",
      label: "ツール管理",
      icon: <Tool className="h-4 w-4 mr-2" />,
      href: "/admin/tools",
    },
    {
      id: "requests",
      label: "要望管理",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      href: "/admin/requests",
    },
    {
      id: "users",
      label: "ユーザー管理",
      icon: <Users className="h-4 w-4 mr-2" />,
      href: "/admin/users",
    },
    {
      id: "content",
      label: "コンテンツ管理",
      icon: <FileText className="h-4 w-4 mr-2" />,
      href: "/admin/content",
    },
    {
      id: "analytics",
      label: "アクセス解析",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      href: "/admin/analytics",
    },
    {
      id: "notifications",
      label: "通知管理",
      icon: <Bell className="h-4 w-4 mr-2" />,
      href: "/admin/notifications",
    },
    {
      id: "settings",
      label: "システム設定",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: "/admin/settings",
    },
  ]

  return (
    <div className="w-full md:w-64 mb-6 md:mb-0">
      <div className="bg-white border border-amber-200 rounded-lg p-4">
        <h2 className="font-semibold text-amber-800 mb-4 pb-2 border-b border-amber-100">開発者メニュー</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <Button
                variant={activePage === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activePage === item.id
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "text-amber-800 hover:bg-amber-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
