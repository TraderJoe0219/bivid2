import Link from 'next/link'
import { Search, Users, BookOpen, Heart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-elder-bg">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-elder">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-elder-accent">Bivid</h1>
              <span className="ml-3 text-lg text-gray-600">スキルシェア</span>
            </div>
            <nav className="nav-elder">
              <Link href="/search" className="hover:text-elder-accent">
                スキルを探す
              </Link>
              <Link href="/teach" className="hover:text-elder-accent">
                教える
              </Link>
              <Link href="/login" className="btn-primary">
                ログイン
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main>
        {/* ヒーローセクション */}
        <section className="py-20 text-center">
          <div className="container-elder">
            <h2 className="text-4xl font-bold text-elder-text mb-6">
              人生経験を活かして<br />
              新しいことを学びませんか？
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Bividは、豊富な人生経験を持つ方々が互いにスキルを教え合い、
              新しい学びを得られるプラットフォームです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="btn-primary text-xl px-8 py-4">
                <Search className="w-6 h-6 mr-2" />
                スキルを探す
              </Link>
              <Link href="/teach" className="btn-secondary text-xl px-8 py-4">
                <BookOpen className="w-6 h-6 mr-2" />
                教える
              </Link>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-16 bg-white">
          <div className="container-elder">
            <h3 className="text-3xl font-bold text-center text-elder-text mb-12">
              Bividの特徴
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-elder text-center">
                <div className="w-16 h-16 bg-elder-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">安心のコミュニティ</h4>
                <p className="text-gray-600">
                  同世代の方々との安心できる環境で、
                  気軽にスキルを共有できます。
                </p>
              </div>
              <div className="card-elder text-center">
                <div className="w-16 h-16 bg-elder-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">豊富なスキル</h4>
                <p className="text-gray-600">
                  料理、園芸、手芸、楽器演奏など、
                  様々なスキルを学ぶことができます。
                </p>
              </div>
              <div className="card-elder text-center">
                <div className="w-16 h-16 bg-elder-warning rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">つながりを大切に</h4>
                <p className="text-gray-600">
                  スキルを通じて新しい友人関係を築き、
                  充実した時間を過ごせます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 人気のスキルカテゴリ */}
        <section className="py-16">
          <div className="container-elder">
            <h3 className="text-3xl font-bold text-center text-elder-text mb-12">
              人気のスキルカテゴリ
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  href={`/search?category=${encodeURIComponent(category)}`}
                  className="card-elder hover:shadow-lg transition-shadow text-center py-6"
                >
                  <span className="text-lg font-medium">{category}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container-elder">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Bivid</h4>
              <p className="text-gray-300">
                高齢者向けスキルシェアプラットフォーム
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">サービス</h5>
              <ul className="space-y-2">
                <li><Link href="/search" className="text-gray-300 hover:text-white">スキルを探す</Link></li>
                <li><Link href="/teach" className="text-gray-300 hover:text-white">教える</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white">Bividについて</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">サポート</h5>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-300 hover:text-white">ヘルプ</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">お問い合わせ</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white">プライバシーポリシー</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Bivid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
