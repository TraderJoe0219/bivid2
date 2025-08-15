'use client';

import React from 'react';
import { Star, MapPin, Calendar, Edit, MessageCircle } from 'lucide-react';
import { UserProfile } from '@/lib/profile';

interface ProfileViewProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onContact?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  isOwnProfile = false,
  onEdit,
  onContact
}) => {
  // 星評価の表示
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-5 h-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }
    
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* ヘッダー部分 */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* プロフィール写真 */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              {profile.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt={`${profile.displayName}さんのプロフィール写真`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60">
                  <div className="text-4xl font-bold">
                    {profile.displayName?.charAt(0) || '?'}
                  </div>
                </div>
              )}
            </div>

            {/* 基本情報 */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.displayName}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-white/90 mb-4">
                {profile.age && (
                  <span className="text-lg">{profile.age}歳</span>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              </div>

              {/* 評価 */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(profile.rating)}
                </div>
                <span className="text-white/90 text-lg font-medium">
                  {profile.rating.toFixed(1)}
                </span>
                <span className="text-white/70">
                  ({profile.totalReviews}件のレビュー)
                </span>
              </div>

              {/* アクションボタン */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isOwnProfile ? (
                  <button
                    onClick={onEdit}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    プロフィールを編集
                  </button>
                ) : (
                  <button
                    onClick={onContact}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    メッセージを送る
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左カラム */}
            <div className="lg:col-span-1 space-y-6">
              {/* 自己紹介 */}
              {profile.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">自己紹介</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* 提供可能スキル */}
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">提供可能スキル</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 習得希望スキル */}
              {profile.wantedSkills && profile.wantedSkills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">習得希望スキル</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.wantedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右カラム */}
            <div className="lg:col-span-2 space-y-6">
              {/* 経験・職歴 */}
              {profile.experience && profile.experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">経験・職歴</h3>
                  <div className="space-y-4">
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-orange-200 pl-6 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-1">
                              {exp.title}
                            </h4>
                            {exp.company && (
                              <p className="text-gray-600 mb-2">{exp.company}</p>
                            )}
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <Calendar className="w-4 h-4 mr-1" />
                              {exp.period}
                            </div>
                            {exp.description && (
                              <p className="text-gray-700 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* レビュー */}
              {profile.reviews && profile.reviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    レビュー ({profile.reviews.length}件)
                  </h3>
                  <div className="space-y-4">
                    {profile.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {review.reviewerName}
                            </span>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.createdAt.toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                    
                    {profile.reviews.length > 5 && (
                      <button className="w-full py-2 text-orange-600 hover:text-orange-700 font-medium">
                        すべてのレビューを見る ({profile.reviews.length - 5}件)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* レビューがない場合 */}
              {(!profile.reviews || profile.reviews.length === 0) && !isOwnProfile && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <MessageCircle className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-600">まだレビューがありません</p>
                  <p className="text-sm text-gray-500">
                    {profile.displayName}さんと交流して、最初のレビューを書いてみませんか？
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="bg-gray-50 px-8 py-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              登録日: {profile.createdAt.toLocaleDateString('ja-JP')}
            </span>
            <span>
              最終更新: {profile.updatedAt.toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
