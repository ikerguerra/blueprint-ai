'use client'

import { useState } from 'react'
import { login, signup, loginAsDemo } from '@/app/login/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Rocket, Mail, Lock } from 'lucide-react'

export function LoginForm({ error }: { error?: string }) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-2xl sm:rounded-2xl border border-gray-100 relative overflow-hidden flex flex-col md:flex-row">
      {/* 🚀 Quick Test CTA Side (Left) */}
      <div className="md:w-5/12 p-8 md:p-10 bg-gradient-to-br from-indigo-50 to-blue-50/30 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-indigo-100/60 relative">
        {/* Decorative elements for the dark panel */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-100 opacity-50 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-indigo-100 opacity-50 pointer-events-none blur-2xl" />

        <div className="relative z-10 w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-6 border border-indigo-50">
            <Rocket className="h-8 w-8 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
            Comienza sin fricciones
          </h3>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Accede al instante a un entorno de prueba con nuestra documentación
            técnica instalada. No requiere tarjeta ni registro. Ideal para
            probar las funcionalidades.
          </p>
          <form action={loginAsDemo}>
            <SubmitButton
              text="Entrar a la Prueba Rápida"
              loadingText="Iniciando entorno..."
              variant="cta"
            />
          </form>
        </div>
      </div>

      {/* Manual Login / Signup Form Side (Right) */}
      <div className="md:w-7/12 p-8 md:p-10 relative">
        <div className="mb-8 relative">
          <h3 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {isLogin ? 'Inicia sesión' : 'Crear cuenta'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de usuarios y documentos.
          </p>
        </div>

        {error && (
          <div className="relative mb-6 bg-red-50 border border-red-100 rounded-lg p-3.5 shadow-sm">
            <div className="flex">
              <div className="ml-2">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form action={isLogin ? login : signup} className="space-y-5 relative">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Nombre
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={!isLogin}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="Tu nombre"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <SubmitButton
              text={isLogin ? 'Acceder' : 'Registrarse'}
              loadingText={isLogin ? 'Iniciando...' : 'Registrando...'}
              variant="primary"
            />
          </div>
        </form>

        <div className="mt-8 relative text-center">
          <p className="text-sm text-gray-500 border-t border-gray-100 pt-6">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
