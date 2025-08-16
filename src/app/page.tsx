'use client'

import Link from 'next/link'
import { Search, Users, BookOpen, Heart, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function HomePage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-elder-bg-secondary">{/* Navigation コンポーネントがレイアウトで管理されているのでヘッダーは削除 */}

      {/* メインコンテンツ */}
      <main>
        {/* ヒーローセクション */}
        <section className="section-spacing bg-elder-bg-primary">
          <div className="container-elder text-center">
            <h1 className="text-hero text-elder-text-primary mb-8">
              人生経験を活かして<br />
              <span className="text-elder-brand-primary">新しいこと</span>を学びませんか？
            </h1>
            <p className="text-xl text-elder-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed">
              Bividは、豊富な人生経験を持つ方々が互いにスキルを教え合い、<br className="hidden sm:inline" />
              新しい学びと温かなつながりを得られるプラットフォームです。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
              <Link 
                href="/skills/search"
                className="btn-primary text-xl px-10 py-5 min-h-touch-xl gap-3 w-full sm:w-auto"
              >
                <Search className="w-7 h-7" />
                <span>スキルを探す</span>
              </Link>
              <Link 
                href="/teach"
                className="btn-secondary text-xl px-10 py-5 min-h-touch-xl gap-3 w-full sm:w-auto"
              >
                <BookOpen className="w-7 h-7" />
                <span>教える</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="section-spacing bg-elder-bg-secondary">
          <div className="container-elder">
            <h2 className="text-heading text-center text-elder-text-primary mb-16">
              Bividの特徴
            </h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <Card variant="hover" className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-elder-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle as="h3" className="text-subheading">安心のコミュニティ</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    同世代の方々との安心できる環境で、<br />
                    気軽にスキルを共有できます。
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card variant="hover" className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-elder-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle as="h3" className="text-subheading">豊富なスキル</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    料理、園芸、手芸、楽器演奏など、<br />
                    様々なスキルを学ぶことができます。
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card variant="hover" className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-elder-error rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle as="h3" className="text-subheading">つながりを大切に</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    スキルを通じて新しい友人関係を築き、<br />
                    充実した時間を過ごせます。
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 人気のスキルカテゴリ */}
        <section className="section-spacing bg-elder-bg-primary">
          <div className="container-elder">
            <h2 className="text-heading text-center text-elder-text-primary mb-16">
              人気のスキルカテゴリ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                '料理・お菓子作り',
                '園芸・ガーデニング',
                '手芸・裁縫',
                '楽器演奏',
                'パソコン・スマホ',
                '語学',
                '書道・絵画',
                '健康・体操'
              ].map((category) => (
                <Link
                  key={category}
                  href={`/skills/search?category=${encodeURIComponent(category)}`}
                  className="card-interactive text-center group p-8"
                >
                  <span className="text-lg font-semibold text-elder-text-primary group-hover:text-elder-interactive-primary transition-colors">
                    {category}
                  </span>
                  <ArrowRight className="w-5 h-5 mx-auto mt-3 text-elder-text-muted group-hover:text-elder-interactive-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-elder-text-primary text-white py-16">
        <div className="container-elder">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-elder-brand-primary">Bivid</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                高齢者向けスキルシェアプラットフォーム
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">サービス</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/skills/search" className="text-gray-300 hover:text-white text-lg transition-colors focus-outline rounded">
                    スキルを探す
                  </Link>
                </li>
                <li>
                  <Link href="/teach" className="text-gray-300 hover:text-white text-lg transition-colors focus-outline rounded">
                    教える
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white text-lg transition-colors focus-outline rounded">
                    Bividについて
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">サポート</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white text-lg transition-colors focus-outline rounded">
                    ヘルプ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white text-lg transition-colors focus-outline rounded">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white text-lg transition-colors focus-outline rounded">
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
