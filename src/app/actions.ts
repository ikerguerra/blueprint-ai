'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import prisma from '@/lib/prisma'

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getDocuments(tenantId: string) {
  // Validate that the authenticated user belongs to the requested tenant
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { tenantId: true },
  })

  // Security check: Ensure user is part of the tenant they are requesting
  if (!dbUser || dbUser.tenantId !== tenantId) {
    // In a real app, you might throw an error or return empty
    // For now, if mismatch, strictly use the user's actual tenant
    // return []
  }

  // Use the verified tenantId from DB
  const actualTenantId = dbUser?.tenantId || user.id

  const documents = await prisma.document.findMany({
    where: {
      tenantId: actualTenantId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      filename: true,
      createdAt: true,
      _count: {
        select: { chunks: true },
      },
    },
  })
  return documents
}

export async function deleteDocument(id: string, tenantId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { tenantId: true },
  })

  if (!dbUser || dbUser.tenantId !== tenantId) {
    throw new Error('Acceso no autorizado al tenant')
  }

  await prisma.document.delete({
    where: {
      id: id,
      tenantId: tenantId,
    },
  })

  revalidatePath('/')
}
