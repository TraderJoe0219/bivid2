'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Camera,
  Shield,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { documentUploadSchema, type DocumentUploadFormData, documentTypes } from '@/lib/validations/auth'

interface DocumentUploadProps {
  onSubmit: (data: DocumentUploadFormData) => Promise<void>
  loading: boolean
  error?: string
  success?: string
  onSkip?: () => void
}

export function DocumentUpload({ onSubmit, loading, error, success, onSkip }: DocumentUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema)
  })

  const documentFile = watch('documentFile')
  const documentType = watch('documentType')

  // ファイル選択時の処理
  const handleFileSelect = (file: File) => {
    setValue('documentFile', file)
    clearErrors('documentFile')

    // プレビュー表示
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  // ドラッグ&ドロップ処理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  // ファイル削除
  const removeFile = () => {
    setValue('documentFile', undefined as any)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // ファイルサイズを読みやすい形式に変換
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          身分証明書の提出
        </h2>
        <p className="text-lg text-gray-600">
          安全なサービス利用のため、身分証明書の提出をお願いいたします。<br />
          提出いただいた情報は適切に管理・保護されます。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-lg font-medium">{error}</p>
              <p className="text-red-600 text-base mt-1">
                ファイルの形式やサイズをご確認の上、再度お試しください。
              </p>
            </div>
          </div>
        )}

        {/* 成功メッセージ */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-green-700 text-lg font-medium">{success}</p>
          </div>
        )}

        {/* 書類の種類選択 */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-4">
            提出する書類の種類 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {documentTypes.map((type) => (
              <label
                key={type.value}
                className={`
                  relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                  ${documentType === type.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="radio"
                  {...register('documentType')}
                  value={type.value}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${documentType === type.value 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                    }
                  `}>
                    {documentType === type.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    {type.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.documentType && (
            <p className="mt-2 text-red-600 text-lg">{errors.documentType.message}</p>
          )}
        </div>

        {/* ファイルアップロード */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-4">
            ファイルを選択 <span className="text-red-500">*</span>
          </label>
          
          {!documentFile ? (
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0])
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-xl font-medium text-gray-900 mb-2">
                    ファイルをここにドラッグするか、クリックして選択
                  </p>
                  <p className="text-gray-600 text-base">
                    JPEG、PNG、PDF ファイル（最大10MB）
                  </p>
                </div>
                <Button type="button" variant="outline" size="lg">
                  <Camera className="w-5 h-5 mr-2" />
                  ファイルを選択
                </Button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="プレビュー"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {documentFile.name}
                  </h3>
                  <p className="text-gray-600 text-base mb-2">
                    {formatFileSize(documentFile.size)}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      変更
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="w-4 h-4 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0])
                  }
                }}
                className="hidden"
              />
            </div>
          )}
          
          {errors.documentFile && (
            <p className="mt-2 text-red-600 text-lg">{errors.documentFile.message}</p>
          )}
        </div>

        {/* 注意事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            撮影・アップロード時のご注意
          </h3>
          <ul className="text-blue-800 text-base space-y-2">
            <li>• 書類全体が鮮明に写っているかご確認ください</li>
            <li>• 文字がぼやけていないか、影で隠れていないかご確認ください</li>
            <li>• 有効期限内の書類をご使用ください</li>
            <li>• 個人情報は適切に管理・保護いたします</li>
          </ul>
        </div>

        {/* ボタン */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="flex-1 h-14 text-lg"
            loading={loading}
            disabled={loading || !documentFile || !documentType}
          >
            書類を提出する
          </Button>
          {onSkip && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-14 text-lg"
              onClick={onSkip}
              disabled={loading}
            >
              後で提出する
            </Button>
          )}
        </div>
      </form>

      {/* プライバシー情報 */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          プライバシー保護について
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">
          提出いただいた身分証明書は、本人確認の目的のみに使用され、
          暗号化された状態で安全に保管されます。
          第三者に提供されることはございません。
        </p>
      </div>
    </div>
  )
}