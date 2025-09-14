import { Skill, User, GeoPoint } from '@/types'

// 豊中市内の主要エリアの座標
const TOYONAKA_LOCATIONS: { name: string; coordinates: GeoPoint; area: string }[] = [
  { name: '豊中駅周辺', coordinates: { latitude: 34.7813, longitude: 135.4696 }, area: '本町' },
  { name: '岡町駅周辺', coordinates: { latitude: 34.7886, longitude: 135.4389 }, area: '岡町' },
  { name: '曽根駅周辺', coordinates: { latitude: 34.7755, longitude: 135.4542 }, area: '曽根南町' },
  { name: '服部天神駅周辺', coordinates: { latitude: 34.7941, longitude: 135.4556 }, area: '服部元町' },
  { name: '庄内駅周辺', coordinates: { latitude: 34.7669, longitude: 135.4667 }, area: '庄内東町' },
  { name: '千里中央駅周辺', coordinates: { latitude: 34.8086, longitude: 135.4889 }, area: '新千里東町' },
  { name: '蛍池駅周辺', coordinates: { latitude: 34.7919, longitude: 135.4944 }, area: '蛍池東町' },
  { name: '少路駅周辺', coordinates: { latitude: 34.8030, longitude: 135.4778 }, area: '少路' },
  { name: '緑地公園駅周辺', coordinates: { latitude: 34.8144, longitude: 135.4611 }, area: '寺内' },
  { name: '桃山台駅周辺', coordinates: { latitude: 34.8169, longitude: 135.4444 }, area: '新千里南町' }
]

// サンプル講師データ
const SAMPLE_TEACHERS: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    email: 'tanaka.hiroshi@example.com',
    displayName: '田中 寛',
    photoURL: undefined,
    bio: '30年間小学校で教師をしていました。退職後、子どもたちに勉強の楽しさを伝えたいと思い、個人指導を始めました。',
    age: 65,
    location: '豊中市本町',
    coordinates: TOYONAKA_LOCATIONS[0].coordinates,
    skills: ['数学', '国語', '学習指導'],
    interests: ['読書', '園芸', '将棋'],
    rating: 4.8,
    reviewCount: 23
  },
  {
    email: 'yamamoto.sachiko@example.com',
    displayName: '山本 幸子',
    photoURL: undefined,
    bio: '手芸歴40年のベテランです。編み物、刺繍、パッチワークなど幅広く教えています。初心者の方も大歓迎です。',
    age: 72,
    location: '豊中市岡町',
    coordinates: TOYONAKA_LOCATIONS[1].coordinates,
    skills: ['編み物', '刺繍', 'パッチワーク'],
    interests: ['手芸', '映画鑑賞', '料理'],
    rating: 4.9,
    reviewCount: 31
  },
  {
    email: 'sato.kenji@example.com',
    displayName: '佐藤 健二',
    photoURL: undefined,
    bio: 'IT企業で35年勤務した経験を活かし、シニア向けのパソコン教室を開いています。基礎から丁寧にお教えします。',
    age: 68,
    location: '豊中市曽根南町',
    coordinates: TOYONAKA_LOCATIONS[2].coordinates,
    skills: ['パソコン', 'スマートフォン', 'インターネット'],
    interests: ['テクノロジー', '写真', '旅行'],
    rating: 4.6,
    reviewCount: 18
  },
  {
    email: 'watanabe.midori@example.com',
    displayName: '渡辺 翠',
    photoURL: undefined,
    bio: '茶道歴45年、裏千家師範です。日本の伝統文化を次世代に伝えたいと思っています。心を込めてお教えします。',
    age: 70,
    location: '豊中市服部元町',
    coordinates: TOYONAKA_LOCATIONS[3].coordinates,
    skills: ['茶道', '華道', '書道'],
    interests: ['日本文化', '着物', '俳句'],
    rating: 4.7,
    reviewCount: 26
  },
  {
    email: 'takahashi.masako@example.com',
    displayName: '高橋 雅子',
    photoURL: undefined,
    bio: '管理栄養士として病院で働いていました。健康的で美味しい料理を作るコツをお教えします。',
    age: 63,
    location: '豊中市庄内東町',
    coordinates: TOYONAKA_LOCATIONS[4].coordinates,
    skills: ['料理', '栄養', '健康管理'],
    interests: ['料理', 'ヨガ', 'ウォーキング'],
    rating: 4.8,
    reviewCount: 29
  },
  {
    email: 'nakamura.hiroyuki@example.com',
    displayName: '中村 浩之',
    photoURL: undefined,
    bio: '会社員時代から続けている園芸が趣味です。野菜作りや花の育て方など、ガーデニングの基本をお教えします。',
    age: 69,
    location: '豊中市新千里東町',
    coordinates: TOYONAKA_LOCATIONS[5].coordinates,
    skills: ['ガーデニング', '野菜栽培', '植物の育て方'],
    interests: ['園芸', '自然観察', '登山'],
    rating: 4.5,
    reviewCount: 15
  },
  {
    email: 'kobayashi.yuki@example.com',
    displayName: '小林 由紀',
    photoURL: undefined,
    bio: 'ピアノ講師として30年間指導してきました。クラシックからポップスまで、楽しく音楽を学んでいただけます。',
    age: 66,
    location: '豊中市蛍池東町',
    coordinates: TOYONAKA_LOCATIONS[6].coordinates,
    skills: ['ピアノ', '音楽理論', '楽譜の読み方'],
    interests: ['音楽', 'コンサート鑑賞', '散歩'],
    rating: 4.9,
    reviewCount: 34
  },
  {
    email: 'ito.taro@example.com',
    displayName: '伊藤 太郎',
    photoURL: undefined,
    bio: '書道師範として長年指導してきました。美しい文字を書くコツを基礎から丁寧にお教えします。',
    age: 74,
    location: '豊中市少路',
    coordinates: TOYONAKA_LOCATIONS[7].coordinates,
    skills: ['書道', '筆ペン', '美文字'],
    interests: ['書道', '読書', '歴史'],
    rating: 4.6,
    reviewCount: 21
  },
  {
    email: 'suzuki.hanako@example.com',
    displayName: '鈴木 花子',
    photoURL: undefined,
    bio: '英会話講師として海外でも指導経験があります。日常会話から旅行英語まで、楽しく英語を学びましょう。',
    age: 64,
    location: '豊中市寺内',
    coordinates: TOYONAKA_LOCATIONS[8].coordinates,
    skills: ['英会話', '旅行英語', '発音'],
    interests: ['語学', '海外旅行', '映画'],
    rating: 4.7,
    reviewCount: 27
  },
  {
    email: 'kato.shiro@example.com',
    displayName: '加藤 史郎',
    photoURL: undefined,
    bio: '将棋アマチュア五段です。将棋の基本から戦術まで、年齢に関係なく楽しく指導させていただきます。',
    age: 71,
    location: '豊中市新千里南町',
    coordinates: TOYONAKA_LOCATIONS[9].coordinates,
    skills: ['将棋', '囲碁', 'ボードゲーム'],
    interests: ['将棋', '囲碁', '読書'],
    rating: 4.4,
    reviewCount: 12
  },
  {
    email: 'mori.akiko@example.com',
    displayName: '森 明子',
    photoURL: undefined,
    bio: 'ヨガインストラクターとして10年の経験があります。シニア向けのゆったりとしたヨガを教えています。',
    age: 58,
    location: '豊中市本町',
    coordinates: TOYONAKA_LOCATIONS[0].coordinates,
    skills: ['ヨガ', 'ストレッチ', '呼吸法'],
    interests: ['ヨガ', '健康', '瞑想'],
    rating: 4.8,
    reviewCount: 22
  },
  {
    email: 'hayashi.junko@example.com',
    displayName: '林 順子',
    photoURL: undefined,
    bio: '洋裁歴30年です。基本的な縫い方から、簡単な洋服まで作れるようになります。手作りの楽しさをお伝えします。',
    age: 67,
    location: '豊中市岡町',
    coordinates: TOYONAKA_LOCATIONS[1].coordinates,
    skills: ['洋裁', '手芸', 'リメイク'],
    interests: ['手芸', 'ファッション', 'DIY'],
    rating: 4.6,
    reviewCount: 19
  },
  {
    email: 'ishida.noboru@example.com',
    displayName: '石田 昇',
    photoURL: undefined,
    bio: '写真歴35年のアマチュア写真家です。デジタルカメラの使い方から構図の取り方まで教えます。',
    age: 69,
    location: '豊中市曽根南町',
    coordinates: TOYONAKA_LOCATIONS[2].coordinates,
    skills: ['写真撮影', 'カメラ操作', '画像編集'],
    interests: ['写真', '風景', '旅行'],
    rating: 4.5,
    reviewCount: 16
  },
  {
    email: 'taniguchi.emiko@example.com',
    displayName: '谷口 恵美子',
    photoURL: undefined,
    bio: 'フラワーアレンジメント講師です。季節の花を使った美しいアレンジメントを一緒に作りましょう。',
    age: 61,
    location: '豊中市服部元町',
    coordinates: TOYONAKA_LOCATIONS[3].coordinates,
    skills: ['フラワーアレンジメント', '華道', 'ドライフラワー'],
    interests: ['花', 'ガーデニング', 'インテリア'],
    rating: 4.7,
    reviewCount: 24
  },
  {
    email: 'okamoto.kazuo@example.com',
    displayName: '岡本 和雄',
    photoURL: undefined,
    bio: 'DIY歴20年です。家具の修理から簡単な木工作品まで、道具の使い方から丁寧に教えます。',
    age: 65,
    location: '豊中市庄内東町',
    coordinates: TOYONAKA_LOCATIONS[4].coordinates,
    skills: ['DIY', '木工', '家具修理'],
    interests: ['DIY', '工作', 'アウトドア'],
    rating: 4.4,
    reviewCount: 13
  },
  {
    email: 'matsumoto.reiko@example.com',
    displayName: '松本 礼子',
    photoURL: undefined,
    bio: 'パン作り歴25年です。家庭で簡単に作れるパンから本格的なパンまで、楽しくお教えします。',
    age: 63,
    location: '豊中市新千里東町',
    coordinates: TOYONAKA_LOCATIONS[5].coordinates,
    skills: ['パン作り', '製菓', '発酵'],
    interests: ['料理', 'パン', 'お菓子作り'],
    rating: 4.8,
    reviewCount: 28
  },
  {
    email: 'fujiwara.koji@example.com',
    displayName: '藤原 康二',
    photoURL: undefined,
    bio: '太極拳歴15年の指導員です。ゆっくりとした動きで体と心を整える太極拳を始めませんか？',
    age: 70,
    location: '豊中市蛍池東町',
    coordinates: TOYONAKA_LOCATIONS[6].coordinates,
    skills: ['太極拳', '気功', '健康体操'],
    interests: ['武術', '健康', '瞑想'],
    rating: 4.6,
    reviewCount: 17
  },
  {
    email: 'nomura.sachiko@example.com',
    displayName: '野村 幸子',
    photoURL: undefined,
    bio: '着付け講師として20年指導しています。着物の着方から帯の結び方まで、和装の美しさをお伝えします。',
    age: 68,
    location: '豊中市少路',
    coordinates: TOYONAKA_LOCATIONS[7].coordinates,
    skills: ['着付け', '和装', '着物のお手入れ'],
    interests: ['着物', '日本文化', '茶道'],
    rating: 4.7,
    reviewCount: 25
  },
  {
    email: 'shimizu.tetsuo@example.com',
    displayName: '清水 哲夫',
    photoURL: undefined,
    bio: '囲碁アマチュア六段です。囲碁の基本ルールから実戦まで、論理的思考を楽しく鍛えましょう。',
    age: 73,
    location: '豊中市寺内',
    coordinates: TOYONAKA_LOCATIONS[8].coordinates,
    skills: ['囲碁', '詰碁', '囲碁の歴史'],
    interests: ['囲碁', '将棋', '歴史'],
    rating: 4.5,
    reviewCount: 14
  },
  {
    email: 'ogawa.mariko@example.com',
    displayName: '小川 真理子',
    photoURL: undefined,
    bio: 'カラオケ講師として歌唱指導をしています。正しい発声方法から表現力まで、歌う楽しさをお教えします。',
    age: 59,
    location: '豊中市新千里南町',
    coordinates: TOYONAKA_LOCATIONS[9].coordinates,
    skills: ['歌唱指導', '発声', '音楽表現'],
    interests: ['音楽', 'カラオケ', 'コンサート'],
    rating: 4.6,
    reviewCount: 20
  }
]

// サンプルスキルデータの生成
export function generateToyonakaSampleSkills(): Skill[] {
  const skills: Skill[] = []

  const skillTemplates = [
    {
      title: '初心者向け算数・数学個別指導',
      description: '小学生から中学生まで、算数・数学の基礎をしっかりと身につけられるよう指導します。計算問題から文章題まで、一人ひとりのペースに合わせて丁寧に教えます。',
      category: 'パソコン・スマホ' as const,
      price: 2500,
      duration: 60,
      isOnline: false,
      teacherIndex: 0,
      tags: ['算数', '数学', '個別指導', '基礎']
    },
    {
      title: '手編み・棒針編み教室',
      description: '基本的な編み目から応用まで、マフラーやセーターなどの作品を一緒に作りましょう。初心者の方でも安心して参加できます。',
      category: '手芸・裁縫' as const,
      price: 2000,
      duration: 90,
      isOnline: false,
      teacherIndex: 1,
      tags: ['編み物', '手芸', '趣味', '初心者歓迎']
    },
    {
      title: 'シニア向けパソコン基礎講座',
      description: 'パソコンの電源の入れ方から、インターネット検索、メールの送受信まで基本操作を学べます。ゆっくり丁寧に指導します。',
      category: 'パソコン・スマホ' as const,
      price: 3000,
      duration: 90,
      isOnline: false,
      teacherIndex: 2,
      tags: ['パソコン', 'シニア', '基礎', 'インターネット']
    },
    {
      title: '茶道入門・裏千家',
      description: '茶道の基本的な作法から心得まで、日本の伝統文化を学びませんか？お抹茶の点て方から丁寧にお教えします。',
      category: '書道・絵画' as const,
      price: 3500,
      duration: 120,
      isOnline: false,
      teacherIndex: 3,
      tags: ['茶道', '日本文化', '作法', '伝統']
    },
    {
      title: '健康料理・栄養バランス講座',
      description: '栄養バランスを考えた美味しい料理を作りませんか？糖尿病や高血圧の方向けのレシピもお教えします。',
      category: '料理・お菓子作り' as const,
      price: 2800,
      duration: 120,
      isOnline: false,
      teacherIndex: 4,
      tags: ['料理', '健康', '栄養', 'シニア向け']
    },
    {
      title: 'ガーデニング・野菜作り教室',
      description: 'ベランダでもできる野菜作りから本格的なガーデニングまで。土作りから収穫まで、楽しく学べます。',
      category: '園芸・ガーデニング' as const,
      price: 2200,
      duration: 90,
      isOnline: false,
      teacherIndex: 5,
      tags: ['ガーデニング', '野菜', '園芸', '自然']
    },
    {
      title: 'ピアノ個人レッスン（初心者歓迎）',
      description: '全くピアノに触ったことがない方でも大丈夫です。クラシックからポップスまで、お好きな曲から始めましょう。',
      category: '楽器演奏' as const,
      price: 3000,
      duration: 60,
      isOnline: false,
      teacherIndex: 6,
      tags: ['ピアノ', '音楽', '初心者', '個人レッスン']
    },
    {
      title: '書道・美文字教室',
      description: '正しい筆の持ち方から美しい文字の書き方まで。日常で使える美文字を身につけませんか？',
      category: '書道・絵画' as const,
      price: 2500,
      duration: 90,
      isOnline: false,
      teacherIndex: 7,
      tags: ['書道', '美文字', '筆ペン', '日本文化']
    },
    {
      title: '日常英会話・旅行英語',
      description: '海外旅行で使える実践的な英語を学びましょう。簡単な日常会話から旅行先で困らない英語まで。',
      category: '語学' as const,
      price: 2800,
      duration: 60,
      isOnline: true,
      teacherIndex: 8,
      tags: ['英会話', '旅行', '日常会話', 'オンライン対応']
    },
    {
      title: '将棋入門・初心者講座',
      description: '将棋のルールから基本的な戦術まで。頭の体操にもなる将棋を始めてみませんか？',
      category: 'その他' as const,
      price: 2000,
      duration: 90,
      isOnline: false,
      teacherIndex: 9,
      tags: ['将棋', 'ボードゲーム', '頭の体操', '初心者']
    },
    {
      title: 'シニアヨガ・やさしいストレッチ',
      description: '椅子に座ったままでもできるヨガで、無理なく体をほぐしましょう。呼吸法も一緒に学べます。',
      category: '健康・体操' as const,
      price: 2200,
      duration: 60,
      isOnline: false,
      teacherIndex: 10,
      tags: ['ヨガ', 'ストレッチ', 'シニア', '健康']
    },
    {
      title: '洋裁・リメイク教室',
      description: '基本的な縫い方から簡単な洋服作りまで。着なくなった服をリメイクして新しく生まれ変わらせましょう。',
      category: '手芸・裁縫' as const,
      price: 2600,
      duration: 120,
      isOnline: false,
      teacherIndex: 11,
      tags: ['洋裁', 'リメイク', '手芸', 'SDGs']
    },
    {
      title: 'デジタルカメラ・写真撮影講座',
      description: 'カメラの基本操作から構図の取り方まで。お孫さんの写真を上手に撮るコツをお教えします。',
      category: 'パソコン・スマホ' as const,
      price: 2800,
      duration: 90,
      isOnline: false,
      teacherIndex: 12,
      tags: ['写真', 'カメラ', 'デジタル', '操作方法']
    },
    {
      title: 'フラワーアレンジメント教室',
      description: '季節の花を使った美しいアレンジメントを作りましょう。お部屋を花で彩る楽しさを体験できます。',
      category: '園芸・ガーデニング' as const,
      price: 3200,
      duration: 90,
      isOnline: false,
      teacherIndex: 13,
      tags: ['フラワーアレンジメント', '花', '季節', 'インテリア']
    },
    {
      title: 'DIY・木工入門',
      description: '簡単な棚や小物入れなど、実用的な木工作品を作りませんか？道具の使い方から安全に作業する方法まで教えます。',
      category: 'その他' as const,
      price: 3000,
      duration: 120,
      isOnline: false,
      teacherIndex: 14,
      tags: ['DIY', '木工', '手作り', '実用的']
    },
    {
      title: '家庭パン作り教室',
      description: '発酵から焼き上げまで、家庭でできる美味しいパン作りを学びましょう。基本の食パンから応用まで。',
      category: '料理・お菓子作り' as const,
      price: 3200,
      duration: 150,
      isOnline: false,
      teacherIndex: 15,
      tags: ['パン作り', '製菓', '発酵', '手作り']
    },
    {
      title: '太極拳・健康体操',
      description: 'ゆっくりとした動きで体と心を整える太極拳。年齢に関係なく始められる健康法です。',
      category: '健康・体操' as const,
      price: 2000,
      duration: 60,
      isOnline: false,
      teacherIndex: 16,
      tags: ['太極拳', '健康', '体操', 'リラックス']
    },
    {
      title: '着物の着付け教室',
      description: '一人で着物が着られるようになりませんか？基本の着付けから帯の結び方まで丁寧に指導します。',
      category: 'その他' as const,
      price: 3500,
      duration: 90,
      isOnline: false,
      teacherIndex: 17,
      tags: ['着付け', '着物', '和装', '日本文化']
    },
    {
      title: '囲碁入門・基本ルール',
      description: '囲碁のルールから基本的な戦術まで。論理的思考を鍛えながら、囲碁の魅力を感じてください。',
      category: 'その他' as const,
      price: 2200,
      duration: 90,
      isOnline: false,
      teacherIndex: 18,
      tags: ['囲碁', 'ボードゲーム', '論理思考', '初心者']
    },
    {
      title: '歌唱指導・カラオケ上達法',
      description: '正しい発声方法から表現力まで。カラオケで上手に歌えるようになるコツをお教えします。',
      category: '楽器演奏' as const,
      price: 2500,
      duration: 60,
      isOnline: false,
      teacherIndex: 19,
      tags: ['歌唱', 'カラオケ', '発声', '音楽']
    }
  ]

  skillTemplates.forEach((template, index) => {
    const teacher = SAMPLE_TEACHERS[template.teacherIndex]
    const locationData = TOYONAKA_LOCATIONS[template.teacherIndex % TOYONAKA_LOCATIONS.length]

    const skill: Skill = {
      id: `toyonaka-skill-${index + 1}`,
      title: template.title,
      description: template.description,
      category: template.category,
      teacherId: `toyonaka-teacher-${template.teacherIndex + 1}`,
      teacher: {
        ...teacher,
        id: `toyonaka-teacher-${template.teacherIndex + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      },
      price: template.price,
      duration: template.duration,
      location: `${teacher.location}周辺`,
      coordinates: {
        latitude: locationData.coordinates.latitude + (Math.random() - 0.5) * 0.01,
        longitude: locationData.coordinates.longitude + (Math.random() - 0.5) * 0.01
      },
      isOnline: template.isOnline,
      maxStudents: Math.floor(Math.random() * 4) + 2, // 2-5人
      currentStudents: Math.floor(Math.random() * 3), // 0-2人
      images: [],
      tags: template.tags,
      difficulty: (['beginner', 'intermediate'] as const)[Math.floor(Math.random() * 2)],
      rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10, // 4.0-5.0
      reviewCount: Math.floor(Math.random() * 30) + 5, // 5-34件
      isActive: true,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }

    skills.push(skill)
  })

  return skills
}

// 豊中市の講師データを取得
export function getToyonakaTeachers(): User[] {
  return SAMPLE_TEACHERS.map((teacher, index) => ({
    ...teacher,
    id: `toyonaka-teacher-${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }))
}

// 豊中市内のランダムな座標を生成
export function getRandomToyonakaLocation(): GeoPoint {
  const baseLocation = TOYONAKA_LOCATIONS[Math.floor(Math.random() * TOYONAKA_LOCATIONS.length)]
  return {
    latitude: baseLocation.coordinates.latitude + (Math.random() - 0.5) * 0.02,
    longitude: baseLocation.coordinates.longitude + (Math.random() - 0.5) * 0.02
  }
}

// 豊中市の中心座標
export const TOYONAKA_CENTER: GeoPoint = {
  latitude: 34.7813,
  longitude: 135.4696
}