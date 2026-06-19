"use client"
import type React from "react"

import { useState, useRef } from "react"
import { Upload, Trash } from "lucide-react"

interface ImageUploaderProps {
  maxFiles: number
  disabled?: boolean
  onImagesChange: (files: File[]) => void
}

export default function ImageUploader({ maxFiles, disabled, onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)
    const totalFiles = images.length + newFiles.length

    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }

    const newImages = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)
    onImagesChange(updatedImages.map((img) => img.file))
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages.map((img) => img.file))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mx-auto rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border bg-muted p-8 text-center cursor-pointer hover:bg-muted/50 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {images.length}/{maxFiles} images uploaded
        </p>
      </div>

      <input
        ref={fileInputRef}
        disabled={disabled}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded"
              >
                <Trash className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
