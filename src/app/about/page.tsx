'use client'

import Link from 'next/link'
import { Users, Shield, Star, Zap, MapPin, Clock, MessageCircle, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* ヒーローセクション */}
      <section className="py-20 bg-gradient-to-r from-[#0071bc] to-[#ed1e79]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-8">
            BIVIDとは？
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            できることと、頼みたいことをつないで、<br className="hidden sm:inline" />
            地域に小さな助け合いを増やす。
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <p className="text-lg leading-relaxed">
              Bividはアクティブシニアと、日常の手助けを必要とする人をつなぐ<br className="hidden sm:inline" />
              CtoCスキルシェア・プラットフォームです。<br />
              本人確認とレビュー、保険サポートで、はじめてでも安心して始められます。
            </p>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            使い方
          </h2>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* 支援したい方 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0071bc] to-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 ml-4">支援したい方</h3>
                <span className="ml-4 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  アクティブシニア
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">できることを登録</h4>
                    <p className="text-gray-600">得意や経験をタグで選ぶだけ。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">活動エリア・時間帯を設定</h4>
                    <p className="text-gray-600">無理のない範囲でOK。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">AIが候補を提案</h4>
                    <p className="text-gray-600">条件が合う依頼だけ届きます。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">チャットで詳細を確認</h4>
                    <p className="text-gray-600">日程を合わせて実施へ。</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/signup?role=helper"
                  className="inline-flex items-center justify-center w-full bg-[#0071bc] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#005a94] transition-colors duration-200"
                >
                  支援者として登録
                </Link>
              </div>
            </div>

            {/* 依頼したい方 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ed1e79] to-pink-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 ml-4">依頼したい方</h3>
                <span className="ml-4 bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
                  ご本人・ご家族
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-pink-600 font-bold">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">頼みたいことを投稿</h4>
                    <p className="text-gray-600">例：買い物同行、スマホサポート、庭の手入れ。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-pink-600 font-bold">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">日時と場所を指定</h4>
                    <p className="text-gray-600">1回だけでも、定期でもOK。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-pink-600 font-bold">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">AIが最適マッチング</h4>
                    <p className="text-gray-600">評価・距離・スキルから候補を提示。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-pink-600 font-bold">4</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">チャットで合意</h4>
                    <p className="text-gray-600">料金と当日の流れを確認して開始。</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/request"
                  className="inline-flex items-center justify-center w-full bg-[#ed1e79] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#d1185f] transition-colors duration-200"
                >
                  手助けを依頼する
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AIマッチングセクション */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AIマッチングの考え方
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              最適なマッチングのために、AIが複数の要素を総合的に判断します
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">スキルの一致度</h3>
              <p className="text-gray-600">
                庭仕事、スマホサポート、付き添いなど、スキルタグ・カテゴリの合致を優先
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">距離と移動時間</h3>
              <p className="text-gray-600">
                お住まいの近さを優先して、無理のない範囲でのマッチング
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">時間帯の合致</h3>
              <p className="text-gray-600">
                希望の時間帯・曜日が合う方を優先的にマッチング
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">評価と実績</h3>
              <p className="text-gray-600">
                これまでのレビュー評価や実施回数を参考に信頼度を評価
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">安全性の確認</h3>
              <p className="text-gray-600">
                本人確認の有無や年齢適合性など、安全項目を重視
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">プライバシー保護</h3>
              <p className="text-gray-600">
                個人情報は適切に管理し、公開は必要最小限の情報のみ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 安心・安全セクション */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              安心・安全への取り組み
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              はじめてでも安心してご利用いただけるよう、3つの安全対策を整えています
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0071bc] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">本人確認</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                身分証による確認を実施。<br />
                プロフィールには必要最小限の情報のみを表示し、プライバシーを保護します。
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ed1e79] to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">レビューと通報</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                相互評価システムで品質を維持。<br />
                不適切な行為があった場合は、通報・ブロック機能で対応できます。
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">保険サポート</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                万が一のトラブルに備えて、<br />
                賠償責任保険への加入案内をご用意しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-gradient-to-r from-[#0071bc] to-[#ed1e79]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            地域の助け合いを、今日から始めませんか？
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            あなたの「できること」や「頼みたいこと」が、<br />
            誰かの役に立ち、温かいつながりを生み出します。
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <Link
              href="/signup?role=helper"
              className="flex items-center justify-center bg-white text-[#0071bc] font-semibold text-xl px-10 py-5 min-h-[60px] gap-3 w-full sm:w-auto rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <Users className="w-7 h-7" />
              <span>支援者として登録</span>
            </Link>

            <Link
              href="/request"
              className="flex items-center justify-center bg-[#ed1e79] border-2 border-white text-white font-semibold text-xl px-10 py-5 min-h-[60px] gap-3 w-full sm:w-auto rounded-xl hover:bg-[#d1185f] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <MessageCircle className="w-7 h-7" />
              <span>手助けを依頼する</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}