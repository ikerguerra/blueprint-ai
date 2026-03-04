'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function loginAsDemo() {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'demo@blueprintai.com',
      password: 'Demo1234!',
    })

    if (error) {
      redirect('/login?error=No se pudo iniciar la prueba rápida')
    }
  } catch (err) {
    console.error('Login Error:', err)
    redirect('/login?error=Error de conexión con el servidor (Timeout)')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect('/login?error=No se pudo autenticar al usuario')
    }
  } catch (err) {
    console.error('Login Error:', err)
    redirect('/login?error=Error de conexión temporal. Intenta de nuevo.')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      redirect('/login?error=No se pudo crear el usuario')
    }
  } catch (err) {
    console.error('Signup Error:', err)
    redirect('/login?error=Error de conexión temporal. Intenta de nuevo.')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
