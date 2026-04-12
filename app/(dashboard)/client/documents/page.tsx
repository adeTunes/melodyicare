'use client'

import { useState, useCallback } from 'react'
import { FileText, Upload, Trash2, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/lib/hooks/useAuth'
import { useDocuments } from '@/lib/hooks/client/useDocuments'
import { uploadFile } from '@/lib/firebase/storage'
import { createDocument, removeDocument } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import type { DocumentType } from '@/lib/types'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'medical-certificate', label: 'Medical Records' },
  { value: 'id-card', label: 'ID Documents' },
  { value: 'hmo-card', label: 'HMO/Insurance' },
  { value: 'other', label: 'Other' },
]

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png'
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function DocumentsPage() {
  const { user } = useAuth()
  const { data: documents, isLoading } = useDocuments(user?.uid)
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [selectedType, setSelectedType] = useState<DocumentType>('medical-certificate')

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || !user) return

    const file = files[0]
    if (!file) return

    if (file.size > MAX_SIZE) {
      toast.error('File too large. Maximum size is 10MB.')
      return
    }

    setUploading(true)
    try {
      const path = `documents/${user.uid}/${Date.now()}-${file.name}`
      const fileURL = await uploadFile(path, file)

      await createDocument('documents', {
        ownerId: user.uid,
        ownerRole: 'client',
        type: selectedType,
        name: file.name,
        fileURL,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.documents.byOwner(user.uid) })
      toast.success('Document uploaded successfully!')
    } catch {
      toast.error('Failed to upload document.')
    } finally {
      setUploading(false)
    }
  }, [user, selectedType, queryClient])

  const handleDelete = async (docId: string) => {
    try {
      await removeDocument('documents', docId)
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.documents.byOwner(user.uid) })
      }
      toast.success('Document deleted.')
    } catch {
      toast.error('Failed to delete document.')
    }
  }

  const filteredDocs = (type: DocumentType) =>
    documents?.filter((d) => d.type === type) ?? []

  return (
    <div className='space-y-6'>
      <PageHeader title='Documents' description='Upload and manage your medical records and documents' />

      {/* Upload Area */}
      <Card>
        <CardHeader><CardTitle className='text-lg'>Upload Document</CardTitle></CardHeader>
        <CardContent>
          <div className='flex items-end gap-4'>
            <div className='flex-1'>
              <label className='text-sm font-medium mb-1 block'>Document Type</label>
              <select
                className='w-full rounded-md border px-3 py-2 text-sm'
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DocumentType)}
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <label className='cursor-pointer'>
              <Button disabled={uploading} onClick={() => {}}>
                {uploading ? (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                ) : (
                  <Upload className='mr-2 size-4' />
                )}
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input
                type='file'
                className='hidden'
                accept={ACCEPTED_TYPES}
                onChange={(e) => handleUpload(e.target.files)}
                disabled={uploading}
              />
            </label>
          </div>
          <p className='text-xs text-muted-foreground mt-2'>
            Accepted: PDF, JPG, PNG. Max size: 10MB.
          </p>
        </CardContent>
      </Card>

      {/* Documents List */}
      {isLoading ? (
        <LoadingTable />
      ) : !documents?.length ? (
        <EmptyState
          icon={FileText}
          title='No documents'
          description='Upload medical records, prescriptions, or ID documents.'
        />
      ) : (
        <Tabs defaultValue={DOC_TYPES[0].value}>
          <TabsList>
            {DOC_TYPES.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label} ({filteredDocs(t.value).length})
              </TabsTrigger>
            ))}
          </TabsList>
          {DOC_TYPES.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              {filteredDocs(t.value).length === 0 ? (
                <p className='text-sm text-muted-foreground py-8 text-center'>
                  No {t.label.toLowerCase()} uploaded.
                </p>
              ) : (
                <div className='space-y-2'>
                  {filteredDocs(t.value).map((doc) => (
                    <div key={doc.id} className='flex items-center justify-between rounded-lg border p-3'>
                      <div className='flex items-center gap-3'>
                        <FileText className='size-5 text-muted-foreground' />
                        <div>
                          <p className='text-sm font-medium'>{doc.name}</p>
                          <p className='text-xs text-muted-foreground'>
                            {(doc.fileSize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          render={<a href={doc.fileURL} target='_blank' rel='noopener noreferrer' />}
                        >
                          <Download className='size-4' />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button variant='ghost' size='icon'>
                              <Trash2 className='size-4 text-red-500' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete document?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The file will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(doc.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
