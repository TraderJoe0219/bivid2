'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link 
            href="/signup" 
            className="inline-flex items-center text-orange-600 hover:text-orange-500 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            会員登録に戻る
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bivid個人情報保護方針</h1>
            <p className="text-gray-600">プライバシーポリシー</p>
          </div>
        </div>

        {/* プライバシーポリシー本文 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            
            <div className="mb-8 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <p className="text-gray-800 leading-relaxed">
                ライフウェイズ株式会社（以下「当社」といいます）は、当社が提供する「Bivid」（以下「本サービス」といいます）の運営にあたり、利用者の個人情報を適切に取り扱うことを社会的責務と認識し、以下の方針に基づき個人情報の保護に努めます。
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第1条（法令等の遵守）</h2>
              <p className="text-gray-700 leading-relaxed">
                当社は、個人情報の保護に関する法律その他の関連法令およびガイドラインを遵守し、個人情報を適切に取り扱います。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第2条（個人情報の定義）</h2>
              <p className="text-gray-700 leading-relaxed">
                「個人情報」とは、氏名、生年月日、住所、電話番号、メールアドレス、銀行口座情報、決済情報、健康や生活状況等、特定の個人を識別できる情報をいいます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第3条（個人情報の取得方法）</h2>
              <p className="text-gray-700 mb-4">当社は、利用者が本サービスを利用する際に以下の方法で個人情報を取得します。</p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>利用者による会員登録、プロフィール入力、アンケート回答</li>
                <li>サービス利用履歴、決済履歴の自動的な記録</li>
                <li>お問い合わせ、サポート対応に伴う取得</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第4条（利用目的）</h2>
              <p className="text-gray-700 mb-4">当社は、取得した個人情報を以下の目的で利用します。</p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>本サービスの提供、運営、マッチングの実施</li>
                <li>本人確認、決済処理、報酬支払い</li>
                <li>サービス品質向上のための評価・フィードバック収集</li>
                <li>保険適用および事故発生時の対応</li>
                <li>お問い合わせ対応、サポート提供</li>
                <li>利用状況や満足度に関する調査・研究</li>
                <li>サービス改善や新機能開発に向けた分析</li>
                <li>法令に基づく利用</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第5条（第三者提供）</h2>
              <p className="text-gray-700 mb-4">当社は、利用者の同意なく個人情報を第三者に提供しません。ただし、次の場合はこの限りではありません。</p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>法令に基づく場合</li>
                <li>利用目的達成に必要な範囲で業務委託先に提供する場合</li>
                <li>個人を識別できない統計情報として利用・提供する場合</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第6条（個人情報の管理）</h2>
              <p className="text-gray-700 leading-relaxed">
                当社は、個人情報の漏洩、滅失、毀損を防ぐため、必要かつ適切な安全管理措置を講じます。また、従業員および委託先に対しても個人情報保護のための監督を行います。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第7条（個人情報の開示・訂正・削除等）</h2>
              <p className="text-gray-700 leading-relaxed">
                利用者は、当社が保有する自己の個人情報について、開示・訂正・追加・削除・利用停止・消去を請求することができます。請求があった場合、当社は法令に従い、速やかに対応します。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第8条（クッキー・アクセス解析）</h2>
              <p className="text-gray-700 leading-relaxed">
                本サービスでは、利便性向上や利用状況の把握のため、クッキーやアクセス解析ツールを利用する場合があります。これにより収集される情報は、個人を特定するものではありません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第9条（未成年者の利用）</h2>
              <p className="text-gray-700 leading-relaxed">
                未成年者や判断能力が制限される方が利用する場合は、親権者または後見人の同意のもとで個人情報を提供するものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第10条（反社会的勢力の排除）</h2>
              <p className="text-gray-700 leading-relaxed">
                当社は、反社会的勢力への個人情報の提供を一切行いません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第11条（継続的改善）</h2>
              <p className="text-gray-700 leading-relaxed">
                当社は、個人情報の取り扱いに関する運用を定期的に見直し、継続的な改善を行います。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第12条（お問い合わせ窓口）</h2>
              <p className="text-gray-700 mb-4">当社の個人情報の取扱いに関するお問い合わせは、以下の窓口までお願いいたします。</p>
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="space-y-2">
                  <p className="text-gray-800 font-medium">ライフウェイズ株式会社　Bivid運営事務局</p>
                  <p className="text-gray-700">
                    <strong>住所：</strong>〒560-0084 大阪府豊中市新千里南町2丁目12-10
                  </p>
                  <p className="text-gray-700">
                    <strong>メール：</strong>
                    <a href="mailto:info@bivid.jp" className="text-orange-600 hover:text-orange-500 underline">
                      info@bivid.jp
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>電話：</strong>
                    <a href="tel:06-6152-7640" className="text-orange-600 hover:text-orange-500 underline">
                      06-6152-7640
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                個人情報の適切な取り扱いにより、安心してご利用いただけるサービスの提供に努めております。
              </p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            会員登録に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}