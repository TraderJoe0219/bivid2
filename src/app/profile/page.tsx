'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { ProfileView } from '@/components/profile/ProfileView';
import { useAuthStore } from '@/store/authStore';
import { 
  getUserProfile, 
  saveUserProfile, 
  uploadProfilePhoto,
  UserProfile 
} from '@/lib/profile';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // プロフィール読み込み
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.uid);
        
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // プロフィールが存在しない場合は編集モードで開始
          setProfile({
            uid: user.uid,
            displayName: user.displayName || '',
            photoURL: user.photoURL || undefined,
            location: '',
            bio: '',
            skills: [],
            wantedSkills: [],
            experience: [],
            reviews: [],
            rating: 0,
            totalReviews: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          setIsEditing(true);
        }
      } catch (err) {
        console.error('プロフィール読み込みエラー:', err);
        setError('プロフィールの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (user) {
        loadProfile();
      } else {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  // プロフィール保存
  const handleSave = async (updatedProfile: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      
      const profileData = {
        ...updatedProfile,
        uid: user.uid,
      };
      
      await saveUserProfile(profileData);
      
      // 最新のプロフィールを再読み込み
      const savedProfile = await getUserProfile(user.uid);
      if (savedProfile) {
        setProfile(savedProfile);
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('プロフィール保存エラー:', err);
      setError(err instanceof Error ? err.message : 'プロフィールの保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // 写真アップロード
  const handlePhotoUpload = async (file: File): Promise<string> => {
    if (!user) throw new Error('ログインが必要です');
    
    try {
      const photoURL = await uploadProfilePhoto(user.uid, file);
      return photoURL;
    } catch (err) {
      console.error('写真アップロードエラー:', err);
      throw err;
    }
  };

  // ローディング中
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">プロフィールを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // プロフィールが存在しない場合
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">プロフィールが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isEditing ? (
        <ProfileEditor
          profile={profile}
          onSave={handleSave}
          onPhotoUpload={handlePhotoUpload}
          isLoading={saving}
        />
      ) : (
        <ProfileView
          profile={profile}
          isOwnProfile={true}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
