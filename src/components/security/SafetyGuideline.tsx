export default function SafetyGuideline() {
  return (
    <section className="prose max-w-none">
      <h2 className="text-xl font-bold">安全ガイドライン</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>初回の面談は公共の場所で実施</strong>（カフェ・公共施設など）</li>
        <li><strong>高額な金銭・物品の受け渡しは禁止</strong>。現地決済は少額現金のみ</li>
        <li><strong>個人情報の取り扱いに注意</strong>（自宅住所や銀行情報の共有は避ける）</li>
        <li><strong>連絡はアプリ内のメッセージを優先</strong>し、外部連絡先の交換は慎重に</li>
        <li><strong>体調不良や危険を感じた場合は中断</strong>し、緊急連絡先や運営へ連絡</li>
      </ul>
      <p className="text-sm text-gray-600 mt-4">
        不適切な行為や詐欺の疑いがある場合は、報告機能からお知らせください。
      </p>
    </section>
  )
}
