import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              利用規約
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Bividサービスをご利用いただくにあたり、以下の利用規約をお読みください。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">利用規約</h3>
                  <p className="text-sm text-gray-600">サービス利用に関する基本的なルール</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <Scale className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">法的効力</h3>
                  <p className="text-sm text-gray-600">本規約は法的な拘束力を持ちます</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">禁止事項</h3>
                  <p className="text-sm text-gray-600">サービス利用時の禁止行為を定義</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">適正な利用</h3>
                  <p className="text-sm text-gray-600">安全で快適なサービス環境を保持</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              最終更新: 2024年9月14日
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第1条（適用）</h2>
              <p className="text-gray-600 mb-4">
                本利用規約（以下「本規約」）は、Bivid株式会社（以下「当社」）が提供するサービス「Bivid」（以下「本サービス」）の利用条件を定めるものです。
              </p>
              <p className="text-gray-600">
                利用者は、本サービスを利用することによって、本規約に同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第2条（利用登録）</h2>
              <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                <li>利用登録を希望する者は、本規約に同意の上、当社の定める方法によって利用登録を申請するものとします。</li>
                <li>当社は、利用登録の申請者に対し、当社の基準に従って、利用登録の可否を決定し、結果を通知します。</li>
                <li>利用登録が完了した時点で、利用者と当社との間で本サービスの利用契約が成立します。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第3条（禁止事項）</h2>
              <p className="text-gray-600 mb-4">
                利用者は、本サービスの利用にあたり、以下の行為をしてはなりません：
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>他の利用者、第三者または当社の権利を侵害する行為</li>
                <li>虚偽の情報を登録する行為</li>
                <li>営業、宣伝、広告、勧誘等を目的とする行為</li>
                <li>本サービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第4条（本サービスの提供の停止等）</h2>
              <p className="text-gray-600 mb-4">
                当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>システムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により提供が困難な場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当社が本サービスの提供が困難と判断した場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第5条（利用制限および登録抹消）</h2>
              <p className="text-gray-600 mb-4">
                当社は、利用者が以下のいずれかに該当する場合には、事前の通知または催告なしに、当該利用者に対する本サービスの全部もしくは一部の利用を制限し、または利用者としての登録を抹消することができるものとします：
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>本規約のいずれかの条項に違反した場合</li>
                <li>登録事項に虚偽の事実があることが判明した場合</li>
                <li>料金等の支払債務の不履行があった場合</li>
                <li>当社からの連絡に対し、一定期間返答がない場合</li>
                <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第6条（保証の否認および免責事項）</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                </p>
                <p className="text-gray-600">
                  当社は、本サービスに起因して利用者に生じたあらゆる損害について、一切の責任を負いません。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第7条（サービス内容の変更等）</h2>
              <p className="text-gray-600">
                当社は、利用者への事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、利用者はこれに同意するものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第8条（利用規約の変更）</h2>
              <p className="text-gray-600">
                当社は以下の場合には、利用者の個別の同意を要することなく、本規約を変更することができるものとします。
                変更後の利用規約は、当社ウェブサイトに掲示された時点から効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第9条（準拠法・裁判管轄）</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  本規約の解釈にあたっては、日本法を準拠法とします。
                </p>
                <p className="text-gray-600">
                  本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
              </div>
            </section>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <p className="text-gray-600 text-center">
                本規約に関するお問い合わせは、<br />
                <strong>legal@bivid.app</strong> までご連絡ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}