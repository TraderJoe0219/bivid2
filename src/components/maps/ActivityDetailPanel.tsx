'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  Navigation,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SocialActivity } from '@/lib/socialActivities';

interface ActivityDetailPanelProps {
  activity: SocialActivity;
  onClose: () => void;
  onBooking: (activity: SocialActivity) => void;
  onFavorite: (activity: SocialActivity) => void;
  onMessage: (activity: SocialActivity) => void;
  onShare: (activity: SocialActivity) => void;
  onGetDirections: (activity: SocialActivity) => void;
  isFavorited?: boolean;
  className?: string;
}

export function ActivityDetailPanel({
  activity,
  onClose,
  onBooking,
  onFavorite,
  onMessage,
  onShare,
  onGetDirections,
  isFavorited = false,
  className = ''
}: ActivityDetailPanelProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // 画像ギャラリー
  const images = activity.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // レビュー表示制限
  const displayedReviews = showAllReviews 
    ? activity.reviews || []
    : (activity.reviews || []).slice(0, 3);

  // 料金表示
  const formatPrice = (price: number) => {
    return price === 0 ? '無料' : `¥${price.toLocaleString()}`;
  };

  // 評価表示
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`bg-white shadow-xl ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex-1 mr-4">
          {activity.title}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="閉じる"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* スクロール可能なコンテンツエリア */}
      <div className="overflow-y-auto flex-1">
        {/* 画像ギャラリー */}
        {images.length > 0 && (
          <div className="relative">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={`${activity.title} - 画像 ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  aria-label="前の画像"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  aria-label="次の画像"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* 画像インジケーター */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                      aria-label={`画像 ${index + 1} を表示`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 基本情報 */}
        <div className="p-6 space-y-6">
          {/* カテゴリと評価 */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              {activity.category}
            </span>
            <div className="flex items-center space-x-1">
              {renderStars(activity.rating)}
              <span className="ml-2 text-sm text-gray-600">
                ({activity.reviewCount || 0}件)
              </span>
            </div>
          </div>

          {/* 説明 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">活動内容</h3>
            <p className="text-gray-600 leading-relaxed">{activity.description}</p>
          </div>

          {/* 詳細情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">開催日時</div>
                <div className="font-medium">{activity.date}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">所要時間</div>
                <div className="font-medium">{activity.duration}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">定員</div>
                <div className="font-medium">{activity.capacity}名</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">場所</div>
                <div className="font-medium">{activity.location.address}</div>
              </div>
            </div>
          </div>

          {/* 料金 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">参加費</span>
              <span className="text-2xl font-bold text-orange-600">
                {formatPrice(activity.price)}
              </span>
            </div>
          </div>

          {/* 提供者プロフィール */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">提供者</h3>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                {activity.organizer.avatar ? (
                  <img
                    src={activity.organizer.avatar}
                    alt={activity.organizer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-orange-200 flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-lg">
                      {activity.organizer.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{activity.organizer.name}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  {renderStars(activity.organizer.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    ({activity.organizer.reviewCount}件)
                  </span>
                </div>
                {activity.organizer.bio && (
                  <p className="text-sm text-gray-600 mt-2">{activity.organizer.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* レビュー */}
          {activity.reviews && activity.reviews.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">レビュー</h3>
                {activity.reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    {showAllReviews ? '一部を表示' : 'すべて表示'}
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {displayedReviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      {review.reviewerName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {/* 主要アクション */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => onBooking(activity)}
            className="bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>予約する</span>
          </button>
          
          <button
            onClick={() => onGetDirections(activity)}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Navigation className="w-5 h-5" />
            <span>ルート案内</span>
          </button>
        </div>

        {/* サブアクション */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onFavorite(activity)}
            className={`py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 ${
              isFavorited
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            <span className="text-sm">お気に入り</span>
          </button>
          
          <button
            onClick={() => onMessage(activity)}
            className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">メッセージ</span>
          </button>
          
          <button
            onClick={() => onShare(activity)}
            className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">共有</span>
          </button>
        </div>
      </div>
    </div>
  );
}
