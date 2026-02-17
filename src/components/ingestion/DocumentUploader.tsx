'use client'

import { useState } from 'react'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function DocumentUploader({ tenantId }: { tenantId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
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
        const errorText = await res.text()
        throw new Error(errorText || 'Upload failed')
      }

      setStatus('success')
      setMessage('Document ingested successfully!')
      setFile(null) // Reset file input
    } catch (error: unknown) {
      console.error(error)
      setStatus('error')
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('An unknown error occurred')
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
        <FileText className="mr-2" size={20} />
        Documents
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
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Click to select PDF or TXT'}
            </span>
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
                Ingesting...
              </>
            ) : (
              'Upload & Index'
            )}
          </button>
        )}

        {status === 'success' && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
            <CheckCircle className="mr-2" size={16} />
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
            <AlertCircle className="mr-2" size={16} />
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
