export interface ModelType {
  id: string
  name: string
  image: string
  category: 'female' | 'male'
  subcategory: string
}

export interface AITool {
  id: string
  name: string
  icon: string
  isPro?: boolean
  description: string
}

export interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  type: string
}

export interface GenerationSettings {
  modelId: string
  backgroundType: string
  colorSettings?: {
    hue: number
    saturation: number
    brightness: number
  }
  enhanceSettings?: {
    sharpness: number
    contrast: number
  }
}

export interface GenerationResult {
  id: string
  originalImage: string
  generatedImage: string
  settings: GenerationSettings
  createdAt: Date
}
