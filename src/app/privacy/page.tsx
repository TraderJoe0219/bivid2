import { Shield, Lock, Eye, UserCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              プライバシーポリシー
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Bivid（以下「当社」）は、ユーザーの個人情報保護を重要視しています。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">データ保護</h3>
                  <p className="text-sm text-gray-600">最新のセキュリティ技術で個人情報を保護</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">暗号化通信</h3>
                  <p className="text-sm text-gray-600">全ての通信はSSL/TLSで暗号化</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">透明性</h3>
                  <p className="text-sm text-gray-600">データの利用目的を明確に開示</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <UserCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">利用者同意</h3>
                  <p className="text-sm text-gray-600">同意なしにデータを第三者提供しません</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              最終更新: 2024年9月14日
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 収集する情報</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">1.1 登録情報</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>氏名、メールアドレス、電話番号</li>
                    <li>住所（市区町村レベル）</li>
                    <li>生年月日</li>
                    <li>プロフィール写真（任意）</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">1.2 利用情報</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>サービスの利用履歴</li>
                    <li>メッセージのやり取り</li>
                    <li>評価・レビュー</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 情報の利用目的</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>サービスの提供・運営</li>
                <li>ユーザー間のマッチング</li>
                <li>本人確認</li>
                <li>カスタマーサポート</li>
                <li>サービス改善のための分析</li>
                <li>重要なお知らせの通知</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 情報の共有</h2>
              <p className="text-gray-600 mb-4">
                当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません：
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体の保護のために必要な場合</li>
                <li>サービス提供に必要な業務委託先への提供</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 情報の管理</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  当社は、適切な安全管理措置を講じ、個人情報の漏洩、滅失、毀損の防止に努めます。
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>暗号化技術の使用</li>
                  <li>アクセス制限</li>
                  <li>定期的なセキュリティ監査</li>
                  <li>従業員への教育・研修</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. ユーザーの権利</h2>
              <p className="text-gray-600 mb-4">
                ユーザーは、自身の個人情報について以下の権利を有します：
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>開示請求</li>
                <li>訂正・削除請求</li>
                <li>利用停止請求</li>
                <li>データポータビリティ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. お問い合わせ</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：
                </p>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <strong>メール:</strong> privacy@bivid.app
                  </p>
                  <p className="text-gray-800">
                    <strong>電話:</strong> 0120-XXX-XXX（平日 9:00-18:00）
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 改定について</h2>
              <p className="text-gray-600">
                当社は、本プライバシーポリシーを改定することがあります。
                重要な変更については、サービス内でお知らせいたします。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}