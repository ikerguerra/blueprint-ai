'use client'

import { useState } from 'react'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'

import { useRouter } from 'next/navigation'

const MAX_FILE_SIZE_MB = 1.5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export default function DocumentUploader({
  tenantId,
  isReadOnly,
}: {
  tenantId: string
  isReadOnly?: boolean
}) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setFile(null)
        setStatus('error')
        setMessage(
          `El archivo excede el límite de tamaño de ${MAX_FILE_SIZE_MB} MB.`
        )
        // Reset input value to allow selecting the same file again if desired
        e.target.value = ''
        return
      }

      setFile(selectedFile)
      setStatus('idle')
      setMessage('')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setStatus('uploading')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tenantId', tenantId)

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        let errorMessage = 'Error en la subida'
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          const errorText = await res.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      setStatus('success')
      setMessage('Documento procesado correctamente!')
      setFile(null) // Reset file input
      router.refresh() // Refresh server components (DocumentList)
    } catch (error: unknown) {
      console.error(error)
      setStatus('error')
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('Ocurrió un error desconocido')
      }
    }
  }

  if (isReadOnly) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
        <h3 className="font-semibold text-lg mb-2 flex items-center text-blue-800">
          <FileText className="mr-2" size={20} />
          Modo de Prueba
        </h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          Estás pre-visualizando un entorno de prueba pública equipado con la
          documentación técnica original de Blueprint AI.
          <br />
          <br />
          Para aislar entornos, la subida de nuevos archivos está desactivada.{' '}
          <strong>Crea una cuenta gratuita</strong> para procesar tus propios
          documentos de la misma manera.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
        <FileText className="mr-2" size={20} />
        Subir Documentos
      </h3>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="text-gray-400 mb-2" size={32} />
            <span className="text-sm text-gray-600 font-medium">
              {file ? file.name : 'Click para seleccionar PDF o TXT'}
            </span>
            {!file && (
              <span className="text-xs text-gray-400 mt-1">
                Máximo {MAX_FILE_SIZE_MB} MB por archivo
              </span>
            )}
          </label>
        </div>

        {file && (
          <button
            onClick={handleUpload}
            disabled={status === 'uploading'}
            className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center cursor-pointer transition-colors"
          >
            {status === 'uploading' ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Procesando...
              </>
            ) : (
              'Subir e Indexar'
            )}
          </button>
        )}

        {status === 'success' && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
            <CheckCircle className="mr-2 flex-shrink-0" size={16} />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  )
}
