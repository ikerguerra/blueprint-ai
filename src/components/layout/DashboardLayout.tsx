'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, FileText, LogOut } from 'lucide-react'
import { signout } from '@/app/actions'

interface DashboardLayoutProps {
  userEmail: string
  sidebarContent: React.ReactNode
  mainContent: React.ReactNode
}

export default function DashboardLayout({
  userEmail,
  sidebarContent,
  mainContent,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Close sidebar on window resize if it gets larger than mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-[100dvh] bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer / Fixed Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header (Desktop & Mobile) */}
        <div className="flex p-5 border-b border-gray-200 justify-between items-center">
          <div className="flex items-center space-x-2 text-blue-600">
            <FileText size={28} />
            <span className="text-2xl font-bold">Blueprint AI</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:pt-6 pb-6 space-y-6">
          {sidebarContent}
        </div>

        {/* User Info Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 mt-auto">
          <div className="text-sm font-medium text-gray-700 mb-3 truncate px-2">
            {userEmail}
          </div>
          <form action={signout}>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 text-sm font-medium w-full transition-all p-2 rounded-lg">
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100dvh] min-w-0">
        {/* Mobile Top Navigation Bar */}
        <div className="md:hidden flex-none bg-white border-b border-gray-200 z-20 flex justify-between items-center p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-600">
            <FileText size={24} />
            <span className="text-xl font-bold">Blueprint AI</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 -mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          {mainContent}
        </div>
      </main>
    </div>
  )
}
