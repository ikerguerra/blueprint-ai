import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/chat/ChatWindow'
import DocumentUploader from '@/components/ingestion/DocumentUploader'
import { FileText, LogOut } from 'lucide-react'
import { signout } from './actions'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // For MVP, we use the user's ID as the tenant ID
  // In a real app, you'd fetch the tenant ID from a profile/organization table
  const tenantId = user.id

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar - Document Management */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-blue-600">
            <FileText size={24} />
            <span className="text-xl font-bold">Blueprint AI</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <DocumentUploader tenantId={tenantId} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 mb-2 truncate">
            Logged in as: {user.email}
          </div>
          <form action={signout}>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 text-sm w-full transition-colors">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content - Chat */}
      <main className="flex-1 flex flex-col h-full relative">
        <div className="absolute inset-0 p-6">
          <ChatWindow tenantId={tenantId} />
        </div>
      </main>
    </div>
  )
}
