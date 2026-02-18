'use client'

import { useState, useEffect, useTransition } from 'react'
import { FileText, Trash2, Loader2, RefreshCw } from 'lucide-react'
import { getDocuments, deleteDocument } from '@/app/actions'
import { useRouter } from 'next/navigation'
import Modal from '../ui/Modal'

interface Document {
  id: string
  filename: string
  createdAt: Date
  _count: {
    chunks: number
  }
}

export default function DocumentList({ tenantId }: { tenantId: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      const docs = await getDocuments(tenantId)
      setDocuments(docs)
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [tenantId])

  const confirmDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    startTransition(async () => {
      try {
        await deleteDocument(deleteId, tenantId)
        fetchDocuments() // Refresh list
        router.refresh() // Refresh server components if needed
        setDeleteId(null) // Close modal
      } catch (error) {
        console.error('Failed to delete document:', error)
        alert('Error al eliminar el documento')
      }
    })
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Documentos
        </h3>
        <button
          onClick={fetchDocuments}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          title="Actualizar lista"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin text-gray-400" size={20} />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-sm text-gray-400 italic px-2">
          No hay documentos subidos.
        </p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="bg-gray-50 rounded-lg p-3 group hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <FileText size={16} className="text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-gray-700 truncate"
                      title={doc.filename}
                    >
                      {doc.filename}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString()} •{' '}
                      {doc._count.chunks} fragmentos
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => confirmDelete(doc.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                  title="Eliminar documento"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres eliminar este documento? Esta acción no
            se puede deshacer y eliminará todos los datos asociados.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              Eliminar Documento
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
