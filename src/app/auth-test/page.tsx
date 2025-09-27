'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PhoneVerification } from '@/components/auth/PhoneVerification'
import { DocumentUpload } from '@/components/auth/DocumentUpload'
import { EmergencyContacts } from '@/components/auth/EmergencyContacts'
import { CheckCircle, Phone, FileText, Users, User } from 'lucide-react'

export default function AuthTestPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      id: 1,
      title: '電話番号認証',
      description: 'SMS認証でアカウントを確認',
      icon: Phone,
      component: PhoneVerification
    },
    {
      id: 2,
      title: '身分証明書アップロード',
      description: '本人確認のため身分証をアップロード',
      icon: FileText,
      component: DocumentUpload
    },
    {
      id: 3,
      title: '緊急連絡先設定',
      description: '緊急時の連絡先を設定',
      icon: Users,
      component: EmergencyContacts
    }
  ]

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
    
    // 次のステップに進む
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1)
    }
  }

  const handleStepSelect = (stepId: number) => {
    setCurrentStep(stepId)
  }

  const CurrentComponent = steps.find(step => step.id === currentStep)?.component

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            認証フロー統合テスト
          </h1>
          <p className="text-lg text-gray-600">
            すべての認証コンポーネントの動作を確認
          </p>
        </div>

        {/* ステップナビゲーション */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex space-x-4">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id)
                const isCurrent = currentStep === step.id
                const IconComponent = step.icon

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(step.id)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50'
                        : isCompleted
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <IconComponent className="h-6 w-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`font-medium text-sm ${
                        isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 現在のコンポーネント */}
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              ステップ {currentStep}: {steps.find(s => s.id === currentStep)?.title}
            </h2>
            <p className="text-gray-600">
              {steps.find(s => s.id === currentStep)?.description}
            </p>
          </div>

          {CurrentComponent && (
            <div className="space-y-6">
              <CurrentComponent
                onSuccess={() => handleStepComplete(currentStep)}
                onError={(error: string) => console.error('Component error:', error)}
              />
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              前のステップ
            </Button>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => handleStepComplete(currentStep)}
              >
                このステップを完了
              </Button>
              
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === steps.length}
              >
                次のステップ
              </Button>
            </div>
          </div>
        </Card>

        {/* 完了状況 */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              テスト進捗状況
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step) => {
                const isCompleted = completedSteps.includes(step.id)
                const IconComponent = step.icon

                return (
                  <div
                    key={step.id}
                    className={`flex items-center p-3 rounded-lg ${
                      isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <IconComponent className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${
                        isCompleted ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs ${
                        isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {isCompleted ? '完了' : '未完了'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {completedSteps.length === steps.length && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <div className="font-semibold text-green-700">
                      すべての認証ステップが完了しました！
                    </div>
                    <div className="text-green-600 text-sm">
                      認証フローの統合テストが正常に完了しました。
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* デバッグ情報 */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              デバッグ情報
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-700 space-y-2">
                <div>現在のステップ: {currentStep}</div>
                <div>完了済みステップ: [{completedSteps.join(', ')}]</div>
                <div>進捗: {completedSteps.length}/{steps.length} ({Math.round((completedSteps.length / steps.length) * 100)}%)</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
