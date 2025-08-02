'use client';

import React from 'react';
import { SkillMapSearch } from '@/components/maps/SkillMapSearch';
import { MapPin, Users, Search, Lightbulb } from 'lucide-react';

export default function SkillSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">スキル検索</h1>
              <p className="text-gray-600 mt-2">
                地図でスキル提供者を探して、新しい学びを始めましょう
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 検索機能 */}
        <SkillMapSearch />

        {/* 使い方ガイド */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            スキル検索の使い方
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">1. 場所を設定</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                住所を入力するか、現在地を取得して検索の中心地を設定します
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">2. スキルを検索</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                学びたいスキルを入力し、距離や評価などの条件を設定します
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">3. 提供者を選択</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                地図やリストからスキル提供者を選んで詳細を確認します
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">4. 学習開始</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                気に入った提供者に連絡して、新しいスキルの学習を始めます
              </p>
            </div>
          </div>
        </div>

        {/* 人気のスキルカテゴリ */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            人気のスキルカテゴリ
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: '料理', emoji: '🍳', count: 45 },
              { name: '園芸', emoji: '🌱', count: 32 },
              { name: '手芸', emoji: '🧵', count: 28 },
              { name: '音楽', emoji: '🎵', count: 24 },
              { name: '語学', emoji: '🗣️', count: 19 },
              { name: 'IT', emoji: '💻', count: 15 }
            ].map(category => (
              <div
                key={category.name}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}人</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💡 検索のコツ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-3">効果的な検索方法</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  具体的なスキル名で検索すると見つけやすくなります
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  距離を広めに設定すると選択肢が増えます
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  評価の高い提供者から選ぶと安心です
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-3">学習を成功させるために</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  事前に学習目標を明確にしておきましょう
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  提供者のプロフィールをよく読みましょう
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  質問がある場合は遠慮なく聞いてみましょう
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
