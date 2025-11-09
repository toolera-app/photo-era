import { useState, useCallback } from 'react'
import { UploadedImage } from '@/types'

export function useImageUpload() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadImage = useCallback(async (file: File): Promise<UploadedImage | null> => {
    setIsUploading(true)
    
    try {
      // Create a URL for the uploaded file
      const url = URL.createObjectURL(file)
      
      const uploadedImage: UploadedImage = {
        id: Date.now().toString(),
        url,
        name: file.name,
        size: file.size,
        type: file.type
      }
      
      setUploadedImages(prev => [...prev, uploadedImage])
      return uploadedImage
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }, [])

  const clearImages = useCallback(() => {
    setUploadedImages([])
  }, [])

  return {
    uploadedImages,
    isUploading,
    uploadImage,
    removeImage,
    clearImages
  }
}
