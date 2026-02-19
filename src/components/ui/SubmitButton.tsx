'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  loadingText?: string
  variant?: 'primary' | 'secondary'
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
    'w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
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
