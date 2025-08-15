'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Camera, Plus, X, Save, Eye, AlertCircle } from 'lucide-react';
import { UserProfile, REGIONS, SKILL_CATEGORIES, validateProfile } from '@/lib/profile';

interface ProfileEditorProps {
  profile: Partial<UserProfile>;
  onSave: (profile: Partial<UserProfile>) => Promise<void>;
  onPhotoUpload: (file: File) => Promise<string>;
  isLoading?: boolean;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onSave,
  onPhotoUpload,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // フォーム更新
  const updateField = useCallback((field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  }, []);

  // スキル追加
  const addSkill = useCallback((skillType: 'skills' | 'wantedSkills', skill: string) => {
    if (!skill.trim()) return;
    
    const currentSkills = formData[skillType] || [];
    if (!currentSkills.includes(skill)) {
      updateField(skillType, [...currentSkills, skill]);
    }
  }, [formData, updateField]);

  // スキル削除
  const removeSkill = useCallback((skillType: 'skills' | 'wantedSkills', skill: string) => {
    const currentSkills = formData[skillType] || [];
    updateField(skillType, currentSkills.filter(s => s !== skill));
  }, [formData, updateField]);

  // 経験追加
  const addExperience = useCallback(() => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      period: '',
      description: ''
    };
    updateField('experience', [...(formData.experience || []), newExperience]);
  }, [formData.experience, updateField]);

  // 経験更新
  const updateExperience = useCallback((id: string, field: string, value: string) => {
    const experiences = formData.experience || [];
    const updated = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateField('experience', updated);
  }, [formData.experience, updateField]);

  // 経験削除
  const removeExperience = useCallback((id: string) => {
    const experiences = formData.experience || [];
    updateField('experience', experiences.filter(exp => exp.id !== id));
  }, [formData.experience, updateField]);

  // 写真アップロード
  const handlePhotoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setPhotoUploading(true);
      const photoURL = await onPhotoUpload(file);
      updateField('photoURL', photoURL);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : '写真のアップロードに失敗しました']);
    } finally {
      setPhotoUploading(false);
    }
  }, [onPhotoUpload, updateField]);

  // 保存処理
  const handleSave = useCallback(async () => {
    const validationErrors = validateProfile(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSave(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : '保存に失敗しました']);
    }
  }, [formData, onSave]);

  if (isPreview) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">プロフィールプレビュー</h2>
            <button
              onClick={() => setIsPreview(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              編集に戻る
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* プロフィール写真と基本情報 */}
            <div className="lg:col-span-1">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  {formData.photoURL ? (
                    <img 
                      src={formData.photoURL} 
                      alt="プロフィール写真" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{formData.displayName || '名前未設定'}</h3>
                {formData.age && (
                  <p className="text-gray-600">{formData.age}歳</p>
                )}
                <p className="text-gray-600">{formData.location || '地域未設定'}</p>
              </div>
              
              {formData.bio && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">自己紹介</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{formData.bio}</p>
                </div>
              )}
            </div>

            {/* スキルと経験 */}
            <div className="lg:col-span-2">
              {/* 提供可能スキル */}
              {formData.skills && formData.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">提供可能スキル</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 習得希望スキル */}
              {formData.wantedSkills && formData.wantedSkills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">習得希望スキル</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.wantedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 経験・職歴 */}
              {formData.experience && formData.experience.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">経験・職歴</h4>
                  <div className="space-y-4">
                    {formData.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-orange-200 pl-4">
                        <h5 className="font-medium text-gray-900">{exp.title}</h5>
                        {exp.company && (
                          <p className="text-gray-600">{exp.company}</p>
                        )}
                        <p className="text-sm text-gray-500">{exp.period}</p>
                        {exp.description && (
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">プロフィール編集</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIsPreview(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              プレビュー
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {/* エラー表示 */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-medium text-red-800">入力エラー</span>
            </div>
            <ul className="list-disc list-inside text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 成功メッセージ */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium text-green-800">プロフィールを保存しました</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 基本情報 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
            
            {/* プロフィール写真 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロフィール写真
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  {formData.photoURL ? (
                    <img 
                      src={formData.photoURL} 
                      alt="プロフィール写真" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {photoUploading ? 'アップロード中...' : '写真を選択'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* 名前 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.displayName || ''}
                onChange={(e) => updateField('displayName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                placeholder="山田太郎"
              />
            </div>

            {/* 年齢 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年齢
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.age || ''}
                onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                placeholder="65"
              />
            </div>

            {/* 居住地域 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                居住地域 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              >
                <option value="">地域を選択してください</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* 自己紹介 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自己紹介
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg resize-none"
                placeholder="ご自身について簡単にご紹介ください..."
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {(formData.bio || '').length}/500文字
              </div>
            </div>
          </div>

          {/* スキルと経験 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">スキルと経験</h3>
            
            {/* 提供可能スキル */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提供可能スキル
              </label>
              <div className="space-y-3">
                {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const isSelected = formData.skills?.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => {
                              if (isSelected) {
                                removeSkill('skills', skill);
                              } else {
                                addSkill('skills', skill);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              isSelected
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 習得希望スキル */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                習得希望スキル
              </label>
              <div className="space-y-3">
                {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const isSelected = formData.wantedSkills?.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => {
                              if (isSelected) {
                                removeSkill('wantedSkills', skill);
                              } else {
                                addSkill('wantedSkills', skill);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 経験・職歴 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  経験・職歴
                </label>
                <button
                  onClick={addExperience}
                  className="inline-flex items-center px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  追加
                </button>
              </div>
              
              <div className="space-y-4">
                {(formData.experience || []).map((exp) => (
                  <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">経験 #{exp.id.slice(-4)}</h4>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        placeholder="職種・役職"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="会社名・組織名"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                        placeholder="期間（例：2000年〜2020年）"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="経験の詳細"
                        rows={2}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
