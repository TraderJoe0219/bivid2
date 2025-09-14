'use client'

import Link from 'next/link'
import { Search, Users, BookOpen, Heart, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Logo } from '@/components/ui/Logo'
import { getRandomSkills, getDemoStats } from '@/lib/sampleData'
import { HeroCTAs } from '@/components/HeroCTAs'

export default function HomePage() {
  const { user } = useAuthStore()

  // サンプルデータを取得
  const featuredSkills = getRandomSkills(2) // 2件のランダムスキル
  const stats = getDemoStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Navigation コンポーネントがレイアウトで管理されているのでヘッダーは削除 */}

      {/* メインコンテンツ */}
      <main>
        {/* ヒーローセクション */}
        <section className="py-20 bg-gradient-to-r from-white via-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* テキストコンテンツ */}
              <div className="text-center lg:text-left">
                <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-10 leading-tight">
                  <span className="text-[#0071bc] drop-shadow-sm">できることが、</span><br />
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">地域を支える力になる。</span>
                </h1>
                <p className="text-2xl text-gray-600 mb-10 max-w-4xl leading-relaxed font-medium">
                  得意なことを登録、頼みたいことを投稿。<br className="hidden sm:inline" />
                  <span className="text-[#ed1e79] font-semibold">AI</span>が最適な相手をマッチングします。
                </p>
                <div className="bg-blue-50 border-l-4 border-[#0071bc] rounded-r-2xl p-6 mb-12 max-w-2xl">
                  <p className="text-lg text-gray-700 font-medium">
                    <span className="text-[#0071bc]">✓</span> 本人確認・レビュー・保険サポートで安全にご利用いただけます
                  </p>
                </div>
                <HeroCTAs
                  audience="general"
                  segmented={process.env.NEXT_PUBLIC_EXPERIMENT_HERO_CTA_V1 === "segmented"}
                  className="justify-center lg:justify-start"
                />
              </div>

              {/* 画像 */}
              <div className="relative order-first lg:order-last">
                <div className="aspect-[4/3] relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="/hero-community.jpg"
                    alt="地域の皆さんが笑顔で交流している様子"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-sm font-medium text-gray-800">
                        地域の皆さんが笑顔で交流
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              Bividの特徴
            </h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">安心のコミュニティ</h3>
                <p className="text-lg text-gray-600">
                  同世代の方々との安心できる環境で、<br />
                  気軽にスキルを共有できます。
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">豊富なスキル</h3>
                <p className="text-lg text-gray-600">
                  料理、園芸、手芸、楽器演奏など、<br />
                  様々なスキルを学ぶことができます。
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">つながりを大切に</h3>
                <p className="text-lg text-gray-600">
                  スキルを通じて新しい友人関係を築き、<br />
                  充実した時間を過ごせます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* おすすめスキル */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              おすすめのスキル
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Link href="/skills/1" className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
                    alt="初心者向けお料理教室"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    料理
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    初心者向けお料理教室
                  </h3>
                  <p className="text-gray-600 mb-3">
                    包丁の持ち方から始める、お料理の基礎を楽しく学べます
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>⭐ 4.7 (28件)</span>
                      <span>👥 田中花子先生</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      ¥3,500
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/skills/2" className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"
                    alt="ベランダでできる簡単ガーデニング"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    園芸
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    ベランダでできる簡単ガーデニング
                  </h3>
                  <p className="text-gray-600 mb-3">
                    限られたスペースでも楽しめる、シニア向けガーデニング講座
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>⭐ 4.6 (15件)</span>
                      <span>👥 鈴木一郎先生</span>
                    </div>
                    <span className="text-lg font-semibold text-pink-600">
                      ¥2,500
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/map" className="bg-gradient-to-br from-blue-600 via-blue-700 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden group">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    地図でスキルを探す
                  </h3>
                  <p className="text-white/90 mb-4">
                    お住まいの近くで開催されているスキル講座を地図で簡単に見つけられます
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-white/90">
                    <span>マップを開く</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <Link 
                href="/skills/search"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 min-h-[50px] gap-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>すべてのスキルを見る</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 人気のスキルカテゴリ */}
        <section className="py-20 bg-gradient-to-t from-pink-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              カテゴリから探す
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: '料理・お菓子作り', emoji: '🍳', count: 45 },
                { name: '園芸・ガーデニング', emoji: '🌱', count: 32 },
                { name: '手芸・裁縫', emoji: '🧵', count: 28 },
                { name: '楽器演奏', emoji: '🎵', count: 24 },
                { name: 'パソコン・スマホ', emoji: '💻', count: 19 },
                { name: '語学', emoji: '🗣️', count: 15 },
                { name: '書道・絵画', emoji: '🎨', count: 21 },
                { name: '健康・体操', emoji: '🏃‍♀️', count: 18 }
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/skills/search?category=${encodeURIComponent(category.name)}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center group p-6"
                >
                  <div className="text-4xl mb-3">{category.emoji}</div>
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors block mb-2">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">{category.count}件のスキル</span>
                  <ArrowRight className="w-5 h-5 mx-auto mt-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-pink-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="mb-6">
                <Logo size="lg" showSubtitle={false} />
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                高齢者向けスキルシェアプラットフォーム
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">サービス</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/skills/search" className="text-gray-300 hover:text-white text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    スキルを探す
                  </Link>
                </li>
                <li>
                  <Link href="/teach" className="text-gray-300 hover:text-white text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    教える
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Bividについて
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">サポート</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    ヘルプ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-lg">© 2024 Bivid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
