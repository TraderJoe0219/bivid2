'use client'

import Link from 'next/link'
import { MessageCircle, Phone, Mail, HelpCircle, Book, Users } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* ヘッダーセクション */}
      <section className="py-16 bg-gradient-to-r from-[#0071bc] to-[#ed1e79]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            ヘルプ・サポート
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Bividのご利用でお困りのことがございましたら、<br />
            お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* クイックアクション */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              お問い合わせ方法
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="mailto:support@bivid.app"
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">メールサポート</h3>
                <p className="text-gray-600 mb-4">24時間受付</p>
                <p className="text-sm text-gray-500">support@bivid.app</p>
              </a>

              <a
                href="tel:0120-XXX-XXX"
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">電話サポート</h3>
                <p className="text-gray-600 mb-4">平日 9:00-18:00</p>
                <p className="text-sm text-gray-500">0120-XXX-XXX</p>
              </a>

              <Link
                href="/messages"
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">チャットサポート</h3>
                <p className="text-gray-600 mb-4">リアルタイム対応</p>
                <p className="text-sm text-gray-500">アプリ内チャット</p>
              </Link>
            </div>
          </div>

          {/* よくある質問 */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              よくある質問
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <HelpCircle className="w-6 h-6 text-[#0071bc] mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">登録・利用方法について</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Q. 登録は無料ですか？</h4>
                    <p className="text-gray-600">A. はい、会員登録は無料です。基本的な機能もすべて無料でご利用いただけます。</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Q. 年齢制限はありますか？</h4>
                    <p className="text-gray-600">A. 18歳以上の方にご利用いただけます。特に50歳以上の方の参加を歓迎しています。</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-[#ed1e79] mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">安全・安心について</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Q. 本人確認は必要ですか？</h4>
                    <p className="text-gray-600">A. より安全にご利用いただくため、身分証による本人確認を推奨しています。</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Q. トラブル時のサポートはありますか？</h4>
                    <p className="text-gray-600">A. 24時間サポート体制を整えており、問題があればすぐに対応いたします。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ガイド */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              ご利用ガイド
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Link
                href="/about"
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <Book className="w-8 h-8 text-[#0071bc] mr-4" />
                  <h3 className="text-2xl font-semibold text-gray-900">使い方ガイド</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Bividの基本的な使い方や機能について詳しく説明しています。
                </p>
                <div className="text-[#0071bc] font-medium">詳しく見る →</div>
              </Link>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <HelpCircle className="w-8 h-8 text-[#ed1e79] mr-4" />
                  <h3 className="text-2xl font-semibold text-gray-900">困ったときは</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  技術的な問題やアカウントに関するお困りごとは、サポートまでお気軽にお問い合わせください。
                </p>
                <div className="text-[#ed1e79] font-medium">上記の連絡先をご利用ください</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}