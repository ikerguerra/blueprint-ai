import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import ChatWindow from '@/components/chat/ChatWindow'
import DocumentUploader from '@/components/ingestion/DocumentUploader'
import DocumentList from '@/components/ingestion/DocumentList'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's tenantId from the public schema
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { tenantId: true },
  })

  // Fallback to user.id if not found (should not happen with trigger)
  const tenantId = dbUser?.tenantId ?? user.id

  return (
    <DashboardLayout
      userEmail={user.email ?? 'Usuario'}
      sidebarContent={
        <>
          <DocumentUploader tenantId={tenantId} />
          <DocumentList tenantId={tenantId} />
        </>
      }
      mainContent={<ChatWindow tenantId={tenantId} />}
    />
  )
}
