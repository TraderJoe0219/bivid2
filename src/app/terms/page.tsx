'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bivid利用規約</h1>
            <p className="text-gray-600">改訂版</p>
            <p className="text-sm text-gray-500 mt-2">制定：2025年9月20日</p>
          </div>
        </div>

        {/* 利用規約本文 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第1条（Bivid）</h2>
              <p className="text-gray-700 leading-relaxed">
                「Bivid」とは、ライフウェイズ株式会社（以下「当社」といいます）が提供する、プラチナ世代に向けた生きがい・生活支援を目的としたC to Cスキルシェアプラットフォーム（以下「本サービス」といいます）をいいます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第2条（規約の適用）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>利用者は、本サービスを利用することにより、本規約および当社の定める「個人情報保護方針」に同意したものとみなされます。</li>
                <li>本規約に同意いただけない場合、本サービスを利用することはできません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第3条（利用者の責任）</h2>
              <p className="text-gray-700 leading-relaxed">
                利用者は、自らの意思と責任において本サービスを利用し、利用に関わる一切の行為およびその結果について責任を負うものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第4条（禁止事項）</h2>
              <p className="text-gray-700 mb-4">利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>実際にサービスを提供・受領する意思がないにもかかわらず、虚偽の登録・応募を行う行為</li>
                <li>他人の知的財産権、プライバシー、肖像権、名誉を侵害する行為</li>
                <li>他の利用者を誹謗中傷する行為</li>
                <li>犯罪行為またはそれに結びつく行為</li>
                <li>サービス提供や評価における虚偽の情報の記載</li>
                <li>本サービスを通じて得た情報を無断で複製、販売、配布する行為</li>
                <li>営利目的の勧誘や広告行為（当社が認めたものを除く）</li>
                <li>法令や公序良俗に反する行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第5条（知的財産権）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>本サービスに含まれる文章、画像、プログラム等の知的財産権は、当社または正当な権利者に帰属します。</li>
                <li>利用者が本サービスを通じて投稿したコンテンツ（写真・コメント等）は、当社が匿名化の上で広報や研究開発に利用することができるものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第6条（マッチングと責任）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>本サービスは、利用者同士をマッチングする仕組みを提供するものであり、当社は利用者間の契約成立や履行を保証するものではありません。</li>
                <li>利用者間でトラブルが生じた場合、当社は一切の責任を負わず、当事者間で解決するものとします。ただし、当社は必要に応じて調査・仲裁を行うことがあります。</li>
                <li>安心・安全のため、当社は一定の保険（賠償責任保険等）を導入し、利用者はその範囲内で補償を受けられる場合があります。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第7条（利用料金）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>本サービスの一部は有料であり、利用者は当社が定める方法により料金を支払うものとします。</li>
                <li>サービス提供者には、利用料金から当社が定める手数料（10～15％程度）を控除した金額が支払われます。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第8条（ID・パスワードの管理）</h2>
              <p className="text-gray-700 leading-relaxed">
                会員は、自己のIDおよびパスワードを厳重に管理し、第三者に使用させてはなりません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第9条（個人情報の取り扱い）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>当社は、利用者の個人情報を本サービスの提供、決済、保険適用、調査研究およびサービス改善の目的で利用します。</li>
                <li>当社は、利用者の同意なく第三者に個人情報を提供しません。ただし、法令に基づく場合を除きます。</li>
                <li>利用者は、自己の個人情報の開示、訂正、削除を当社に請求できます。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第10条（サービス提供・受領時のルール）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>本サービスを通じて提供される支援は、介護保険制度の対象外の生活支援を中心とし、医療行為その他法令により制限される行為はできません。</li>
                <li>利用者は、サービス提供・受領にあたり、安全に配慮し、相手方の健康や尊厳を尊重しなければなりません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第11条（決済とキャンセルポリシー）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>利用料金の支払い方法は、当社が指定する方法によります。</li>
                <li>サービスのキャンセルは、当社が定める期限内であれば可能です。期限を過ぎた場合は、返金できないことがあります。</li>
                <li>無断キャンセルや度重なる遅刻は、アカウント停止の対象となります。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第12条（利用者間の評価制度）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>サービス終了後、提供者・受領者は相互に評価を行うものとします。</li>
                <li>不適切な評価や虚偽レビューについては、当社が削除または修正できるものとします。</li>
                <li>評価が一定基準を下回った利用者は、利用制限を受ける場合があります。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第13条（サポート・苦情受付）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>当社は、本サービスに関する問い合わせ窓口を設置します。</li>
                <li>利用者は、トラブルや苦情が発生した場合、速やかに当社へ報告するものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第14条（反社会的勢力の排除）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>利用者は、自らが暴力団関係者その他の反社会的勢力に該当しないことを表明・保証するものとします。</li>
                <li>利用者が反社会的勢力に該当すると判明した場合、当社は直ちに利用を停止できるものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第15条（未成年者・判断能力が制限される方の利用）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>本サービスは、原則として成年者の利用を対象とします。</li>
                <li>未成年者または判断能力が制限される方は、親権者や後見人の同意を得たうえで利用できるものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第16条（利用停止・退会）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>当社は、利用者が本規約に違反した場合、事前の通知なくアカウントを停止・削除できるものとします。</li>
                <li>会員は、所定の手続により退会することができます。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第17条（サービス停止・終了時の取扱い）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>当社は、システム保守や不可抗力によりサービスを停止することがあります。</li>
                <li>サービス終了時には、利用者データを削除または匿名化するものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第18条（免責事項）</h2>
              <p className="text-gray-700 mb-4">当社は、以下の事項について責任を負いません。</p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>利用者間の契約やトラブルにより生じた損害</li>
                <li>通信回線障害、システム不具合等による損害</li>
                <li>天災地変、感染症流行など不可抗力によるサービス提供の停止</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第19条（規約の変更）</h2>
              <p className="text-gray-700 leading-relaxed">
                当社は、利用者への事前通知なく本規約を変更できるものとし、変更後に利用者がサービスを利用した場合は、その内容に同意したものとみなされます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">第20条（準拠法・管轄）</h2>
              <p className="text-gray-700 leading-relaxed">
                本規約は日本法に準拠し、本サービスに関して紛争が生じた場合、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>

            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-gray-600 font-medium">制定：2025年9月20日</p>
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