'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'cta'
}

export function SubmitButton({
  text,
  loadingText = 'Cargando...',
  className = '',
  variant = 'primary',
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  const baseStyles =
    'w-full flex justify-center py-2.5 px-4 border rounded-lg shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center'

  const variants = {
    primary:
      'border-transparent text-white bg-gray-900 hover:bg-gray-800 focus:ring-gray-900',
    secondary:
      'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-200',
    cta: 'border-transparent text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-indigo-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  )
}
