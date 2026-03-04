import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const error =
    typeof searchParams?.error === 'string' ? searchParams.error : undefined

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
        <div className="absolute left-1/3 bottom-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Blueprint AI
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Tu centro de conocimiento inteligente corporativo
          </p>
        </div>

        <LoginForm error={error} />

        <div className="mt-8 text-center text-xs text-gray-400 px-4">
          Al continuar, aceptas nuestros términos de servicio y políticas de
          privacidad.
        </div>
      </div>
    </div>
  )
}
