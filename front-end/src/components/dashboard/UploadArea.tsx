'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UploadedImage } from '@/types'

interface UploadAreaProps {
  onImageUpload: (image: UploadedImage) => void
  onShopifySelect: () => void
}

export function UploadArea({ onImageUpload, onShopifySelect }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = useCallback(async (file: File) => {
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
      
      onImageUpload(uploadedImage)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }, [onImageUpload])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      
      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find(file => file.type.startsWith('image/'))
      
      if (imageFile) {
        handleFileUpload(imageFile)
      }
    },
    [handleFileUpload]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Clothing Photo
          </h1>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">How to Generate AI models? 30s Video Tutorial</span>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-12">
            <div
              className={`text-center ${isDragOver ? 'bg-blue-50' : ''} rounded-lg p-8 transition-colors`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              {/* Upload Icon */}
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag or upload image
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Local Photo'}
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM8 8h8v2H8V8zm0 4h8v2H8v-2z"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        Select photos from
                      </p>
                      <p className="text-sm font-medium text-gray-900">Shopify</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={onShopifySelect}
                    className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
                  >
                    Select Shopify Photo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Format Info */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Supported formats: JPG, PNG, WebP. Max file size: 10MB
        </p>
      </div>
    </div>
  )
}
