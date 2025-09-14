import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_PATH = path.join(process.cwd(), 'content')

export interface ContentMetadata {
  title: string
  description?: string
  lastUpdated: string
  author?: string
  version?: string
}

export interface ContentPage {
  slug: string
  metadata: ContentMetadata
  content: string
}

export interface ContentPageData {
  metadata: ContentMetadata
  content: string
}

export async function getContentPage(slug: string): Promise<ContentPageData> {
  try {
    const filePath = path.join(CONTENT_PATH, `${slug}.md`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      metadata: data as ContentMetadata,
      content
    }
  } catch (error) {
    // ファイルが存在しない場合のフォールバック
    console.warn(`Content file not found: ${slug}.md`)
    return getDefaultContent(slug)
  }
}

export async function getAllContentPages(): Promise<ContentPage[]> {
  try {
    const filenames = fs.readdirSync(CONTENT_PATH)
    const pages = filenames
      .filter(name => name.endsWith('.md'))
      .map(async (filename) => {
        const slug = filename.replace('.md', '')
        const pageData = await getContentPage(slug)
        return {
          slug,
          ...pageData
        }
      })

    return Promise.all(pages)
  } catch (error) {
    console.warn('Content directory not found, returning empty array')
    return []
  }
}

function getDefaultContent(slug: string): ContentPageData {
  const defaultContents: Record<string, ContentPageData> = {
    about: {
      metadata: {
        title: 'Bividについて',
        description: 'Bividは高齢者向けスキルシェアプラットフォームです',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      content: `# Bividについて

Bividは、高齢者の皆様が持つ豊富な知識と経験を共有し、新しいスキルを学び合うためのプラットフォームです。

## 私たちの使命

- 高齢者同士のつながりを深める
- 世代を超えた知識の継承を支援する
- アクセシブルで使いやすいサービスを提供する

## サービスの特徴

### 🧑‍🏫 教える
あなたの専門知識や趣味を他の方に教えることができます。

### 📚 学ぶ
新しいスキルや趣味を始めるサポートを受けることができます。

### 🤝 つながる
同じ興味を持つ仲間との出会いの機会を提供します。

## 運営チーム

Bividは、高齢者の社会参加を支援することを目的として設立されました。`
    },
    help: {
      metadata: {
        title: 'ヘルプ',
        description: 'Bividの使い方やよくある質問',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      content: `# ヘルプ

Bividの使い方について説明します。

## よくある質問

### アカウントについて

#### Q: アカウントの作成方法を教えてください
A: トップページの「新規登録」ボタンから、電話番号またはGoogleアカウントで登録できます。

#### Q: パスワードを忘れました
A: ログインページの「パスワードを忘れた方」リンクから再設定できます。

### スキルの教え方

#### Q: 講師として登録するにはどうすればよいですか？
A: 「教える」ページから3ステップの簡単な登録プロセスで講師として登録できます。

#### Q: 料金はどのように設定すればよいですか？
A: 市場相場を参考に、あなたのスキルレベルと経験に応じて設定してください。

### レッスンの受講について

#### Q: レッスンをキャンセルしたい場合は？
A: レッスン開始の24時間前までであればキャンセル可能です。

#### Q: 支払い方法は何が利用できますか？
A: クレジットカード、デビットカード、PayPayなどが利用できます。

## お問い合わせ

その他のご質問は、以下までお問い合わせください：

- Email: support@bivid.app
- 電話: 0120-XXX-XXX（平日 9:00-18:00）`
    },
    privacy: {
      metadata: {
        title: 'プライバシーポリシー',
        description: 'Bividにおける個人情報の取り扱いについて',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      content: `# プライバシーポリシー

最終更新日: ${new Date().toISOString().split('T')[0]}

Bivid（以下「当社」）は、本サービスをご利用いただくお客様（以下「ユーザー」）の個人情報保護の重要性を認識し、以下のプライバシーポリシーを定めます。

## 1. 個人情報の定義

個人情報とは、ユーザー個人に関する情報であって、氏名、電話番号、メールアドレス、その他の記述により特定の個人を識別することができるものをいいます。

## 2. 個人情報の収集

当社は以下の場合に個人情報を収集します：

- ユーザー登録時
- サービス利用時
- お問い合わせ時
- アンケート回答時

### 収集する個人情報

- 氏名
- 電話番号
- メールアドレス
- 住所
- 生年月日
- プロフィール写真
- レッスン履歴

## 3. 個人情報の利用目的

収集した個人情報は以下の目的で利用します：

- サービスの提供
- ユーザーサポート
- サービス改善のための分析
- 重要なお知らせの配信
- トラブル対応

## 4. 個人情報の第三者提供

当社は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。

## 5. 個人情報の管理

当社は、個人情報の漏洩、滅失、毀損を防止するため、適切な管理措置を講じます。

## 6. お問い合わせ

個人情報の取り扱いに関するご質問は、以下までお問い合わせください：

Email: privacy@bivid.app`
    },
    terms: {
      metadata: {
        title: '利用規約',
        description: 'Bividサービス利用規約',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      content: `# 利用規約

最終更新日: ${new Date().toISOString().split('T')[0]}

Bivid（以下「当社」）が提供するサービス（以下「本サービス」）をご利用いただくにあたり、以下の利用規約（以下「本規約」）をお読みください。

## 第1条（適用）

本規約は、本サービスの利用に関して、当社とユーザーとの間に適用されます。

## 第2条（利用登録）

1. 利用登録を希望する者は、当社の定める方法により利用登録を申請してください
2. 当社は、利用登録の申請について審査し、承認または拒否を決定します
3. 利用登録が完了した時点で、本規約に同意したものとみなします

## 第3条（アカウント管理）

1. ユーザーは、登録情報の管理について責任を負います
2. ユーザーは、第三者にアカウントを利用させてはなりません
3. アカウントの不正利用による損害は、ユーザーが責任を負います

## 第4条（サービス内容）

本サービスは以下の機能を提供します：

- スキルシェアプラットフォーム
- レッスン予約・管理
- 決済処理
- コミュニケーション機能

## 第5条（禁止事項）

ユーザーは以下の行為を禁止します：

- 法令に違反する行為
- 他のユーザーに迷惑をかける行為
- システムの正常な動作を妨げる行為
- 知的財産権を侵害する行為
- 商用目的での無断利用

## 第6条（サービスの停止・中断）

当社は、以下の場合にサービスを停止または中断することがあります：

- システムメンテナンス
- 障害やセキュリティ上の問題
- 天災などの不可抗力

## 第7条（利用料金）

1. 本サービスの基本機能は無料で利用できます
2. 有料機能については別途定める料金表に従います
3. 支払済みの料金は原則として返金しません

## 第8条（免責事項）

当社は、本サービスに関して以下について責任を負いません：

- システムの不具合による損害
- ユーザー間のトラブル
- 第三者による不正アクセス

## 第9条（規約の変更）

当社は、必要に応じて本規約を変更することがあります。変更後の規約は、本サービス内での掲示により効力を生じます。

## 第10条（準拠法・裁判管轄）

本規約は日本法に準拠し、東京地方裁判所を専属的管轄裁判所とします。

## お問い合わせ

Email: legal@bivid.app`
    }
  }

  return defaultContents[slug] || {
    metadata: {
      title: 'ページが見つかりません',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    content: `# ページが見つかりません\n\nリクエストされたページは存在しません。`
  }
}

export function createContentDirectory() {
  if (!fs.existsSync(CONTENT_PATH)) {
    fs.mkdirSync(CONTENT_PATH, { recursive: true })

    // デフォルトコンテンツファイルを作成
    const pages = ['about', 'help', 'privacy', 'terms']
    pages.forEach(slug => {
      const defaultContent = getDefaultContent(slug)
      const fileContent = matter.stringify(defaultContent.content, defaultContent.metadata)
      fs.writeFileSync(path.join(CONTENT_PATH, `${slug}.md`), fileContent)
    })

    console.log('Content directory and default files created')
  }
}