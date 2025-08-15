'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProfileView } from '@/components/profile/ProfileView';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile, UserProfile } from '@/lib/profile';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const uid = params.uid as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // プロフィール読み込み
  useEffect(() => {
    const loadProfile = async () => {
      if (!uid) return;

      try {
        setLoading(true);
        setError(null);
        
        const userProfile = await getUserProfile(uid);
        
        if (userProfile) {
          setProfile(userProfile);
        } else {
          setError('プロフィールが見つかりません');
        }
      } catch (err) {
        console.error('プロフィール読み込みエラー:', err);
        setError('プロフィールの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [uid]);

  // 自分のプロフィールの場合はリダイレクト
  useEffect(() => {
    if (user && uid === user.uid) {
      router.push('/profile');
    }
  }, [user, uid, router]);

  // メッセージ送信（将来の機能）
  const handleContact = () => {
    // TODO: メッセージ機能の実装
    alert('メッセージ機能は準備中です');
  };

  // ローディング中
  if (loading) {
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* 戻るボタン */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </button>
          
          <div className="text-center py-12">
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
      </div>
    );
  }

  // プロフィールが存在しない場合
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </button>
          
          <div className="text-center py-12">
            <p className="text-gray-600">プロフィールが見つかりません</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 戻るボタン */}
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </button>
      </div>
      
      <ProfileView
        profile={profile}
        isOwnProfile={false}
        onContact={handleContact}
      />
    </div>
  );
}
