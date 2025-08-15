/**
 * 地図表示用のサンプル活動データ
 */

import { SocialActivity } from '@/types/activity';

export const SAMPLE_ACTIVITIES: SocialActivity[] = [
  {
    id: '1',
    title: 'パソコン基礎講座',
    description: 'パソコンの基本操作から、インターネットの使い方、メールの送受信まで、初心者の方にも分かりやすく丁寧にお教えします。少人数制で一人ひとりのペースに合わせて進めますので、安心してご参加ください。',
    shortDescription: 'パソコンの基本操作を学びます',
    category: 'seminar',
    subCategory: 'computer',
    tags: ['パソコン', '初心者', '基礎'],
    date: '2024年8月10日（土）10:00-12:00',
    duration: '2時間',
    capacity: 8,
    price: 2000,
    location: {
      address: '大阪府豊中市本町1-1-1 豊中市民会館',
      coordinates: {
        lat: 34.7816,
        lng: 135.4956
      }
    },
    rating: 4.5,
    reviewCount: 12,
    organizer: {
      id: 'teacher1',
      name: '田中一郎',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'IT企業で30年間勤務した経験を活かし、シニア向けのパソコン教室を開催しています。',
      rating: 4.6,
      reviewCount: 45,
      joinedDate: '2023年4月',
      verifiedStatus: true,
      specialties: ['パソコン基礎', 'インターネット', 'スマートフォン']
    },
    reviews: [
      {
        id: 'r1',
        rating: 5,
        comment: '非常に分かりやすく教えていただきました。質問にも丁寧に答えてくださり、安心して学習できました。',
        reviewerName: '佐藤花子',
        reviewerId: 'user1',
        date: '2024年7月15日',
        helpful: 3
      },
      {
        id: 'r2',
        rating: 4,
        comment: '初心者でも理解しやすい内容でした。もう少し時間があればよかったです。',
        reviewerName: '山田太郎',
        reviewerId: 'user2',
        date: '2024年7月10日',
        helpful: 2
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop'
    ],
    maxStudents: 8,
    currentBookings: 5,
    availableSlots: [
      {
        dayOfWeek: 6,
        startTime: '10:00',
        endTime: '12:00',
        isAvailable: true
      }
    ],
    videoURL: null,
    difficulty: 'beginner',
    targetAudience: ['シニア', '初心者'],
    requirements: ['特になし'],
    isActive: true,
    isApproved: true,
    viewCount: 156,
    favoriteCount: 23,
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-20')
  },
  {
    id: '2',
    title: '庭の手入れお手伝い',
    description: '草むしり、植木の剪定、花壇の整備など、庭のお手入れをお手伝いします。重い作業や高所作業も安全に行います。庭をきれいに保ちたいけれど体力的に難しい方、ぜひお声がけください。',
    shortDescription: '庭の草むしりや植木の手入れをします',
    category: 'help',
    subCategory: 'gardening',
    tags: ['庭仕事', '草むしり', '剪定'],
    date: '2024年8月12日（月）9:00-11:00',
    duration: '2時間',
    capacity: 3,
    price: 1500,
    location: {
      address: '大阪府豊中市緑丘2-3-4',
      coordinates: {
        lat: 34.7900,
        lng: 135.5100
      }
    },
    rating: 4.8,
    reviewCount: 8,
    organizer: {
      id: 'teacher2',
      name: '鈴木次郎',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: '造園業で20年の経験があります。お庭のことなら何でもお任せください。',
      rating: 4.9,
      reviewCount: 32,
      joinedDate: '2023年6月',
      verifiedStatus: true,
      specialties: ['庭仕事', '植木剪定', '花壇管理']
    },
    reviews: [
      {
        id: 'r3',
        rating: 5,
        comment: 'とても丁寧に作業していただき、庭がきれいになりました。また依頼したいです。',
        reviewerName: '高橋美子',
        reviewerId: 'user3',
        date: '2024年7月25日',
        helpful: 5
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop'
    ],
    maxStudents: 3,
    currentBookings: 1,
    availableSlots: [
      {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '11:00',
        isAvailable: true
      }
    ],
    videoURL: null,
    difficulty: 'beginner',
    targetAudience: ['どなたでも'],
    requirements: ['汚れても良い服装'],
    isActive: true,
    isApproved: true,
    viewCount: 89,
    favoriteCount: 15,
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-22')
  },
  {
    id: '3',
    title: '料理教室「和食の基本」',
    description: '家庭でできる和食の基本を学びます。だしの取り方から始まり、煮物、焼き物、汁物まで、季節の食材を使った美味しい和食を一緒に作りましょう。レシピもお渡しします。',
    shortDescription: '和食の基本を学ぶ料理教室です',
    category: 'seminar',
    subCategory: 'cooking',
    tags: ['料理', '和食', '基本'],
    date: '2024年8月15日（木）13:00-16:00',
    duration: '3時間',
    capacity: 6,
    price: 3500,
    location: {
      address: '大阪府豊中市岡町北1-2-3 コミュニティセンター',
      coordinates: {
        lat: 34.7750,
        lng: 135.4800
      }
    },
    rating: 4.7,
    reviewCount: 18,
    organizer: {
      id: 'teacher3',
      name: '佐藤恵子',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9a8e2e1?w=150&h=150&fit=crop&crop=face',
      bio: '料理研究家として25年の経験があります。家庭料理の美味しさをお伝えします。',
      rating: 4.8,
      reviewCount: 67,
      joinedDate: '2023年3月',
      verifiedStatus: true,
      specialties: ['和食', '家庭料理', '季節料理']
    },
    reviews: [
      {
        id: 'r4',
        rating: 5,
        comment: 'だしの取り方から丁寧に教えていただき、とても勉強になりました。家でも作ってみます。',
        reviewerName: '伊藤良子',
        reviewerId: 'user4',
        date: '2024年7月18日',
        helpful: 4
      },
      {
        id: 'r5',
        rating: 4,
        comment: '美味しい料理ができました。レシピももらえて嬉しいです。',
        reviewerName: '渡辺健一',
        reviewerId: 'user5',
        date: '2024年7月12日',
        helpful: 2
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'
    ],
    maxStudents: 6,
    currentBookings: 4,
    availableSlots: [
      {
        dayOfWeek: 4,
        startTime: '13:00',
        endTime: '16:00',
        isAvailable: true
      }
    ],
    videoURL: null,
    difficulty: 'beginner',
    targetAudience: ['料理初心者', '和食を学びたい方'],
    requirements: ['エプロン', 'タオル'],
    isActive: true,
    isApproved: true,
    viewCount: 234,
    favoriteCount: 41,
    createdAt: new Date('2024-06-28'),
    updatedAt: new Date('2024-07-19')
  },
  {
    id: '4',
    title: '地域清掃ボランティア',
    description: '地域の公園や道路の清掃活動を行います。みんなで協力して、住みやすい街づくりに貢献しましょう。清掃用具は用意しますので、動きやすい服装でお越しください。',
    shortDescription: '地域の清掃活動に参加しませんか',
    category: 'volunteer',
    subCategory: 'cleaning',
    tags: ['清掃', 'ボランティア', '地域貢献'],
    date: '2024年8月17日（土）8:00-10:00',
    duration: '2時間',
    capacity: 20,
    price: 0,
    location: {
      address: '大阪府豊中市中桜塚1-4-5 桜塚公園',
      coordinates: {
        lat: 34.7650,
        lng: 135.4700
      }
    },
    rating: 4.3,
    reviewCount: 25,
    organizer: {
      id: 'teacher4',
      name: '地域ボランティア会',
      avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150&h=150&fit=crop&crop=face',
      bio: '地域の環境美化活動を行っているボランティア団体です。',
      rating: 4.4,
      reviewCount: 89,
      joinedDate: '2023年1月',
      verifiedStatus: true,
      specialties: ['清掃活動', '環境保護', '地域活動']
    },
    reviews: [
      {
        id: 'r6',
        rating: 4,
        comment: '気持ちよく活動できました。地域がきれいになって嬉しいです。',
        reviewerName: '中村正男',
        reviewerId: 'user6',
        date: '2024年7月20日',
        helpful: 6
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop'
    ],
    maxStudents: 20,
    currentBookings: 12,
    availableSlots: [
      {
        dayOfWeek: 6,
        startTime: '08:00',
        endTime: '10:00',
        isAvailable: true
      }
    ],
    videoURL: null,
    difficulty: 'beginner',
    targetAudience: ['どなたでも'],
    requirements: ['動きやすい服装', '帽子', '飲み物'],
    isActive: true,
    isApproved: true,
    viewCount: 178,
    favoriteCount: 32,
    createdAt: new Date('2024-07-02'),
    updatedAt: new Date('2024-07-21')
  },
  {
    id: '5',
    title: 'スマートフォン活用講座',
    description: 'スマートフォンの便利な機能を学びます。写真の撮り方、アプリの使い方、LINEでのコミュニケーション方法など、日常生活で役立つ機能を分かりやすく説明します。',
    shortDescription: 'スマートフォンを便利に使いこなしましょう',
    category: 'seminar',
    subCategory: 'smartphone',
    tags: ['スマートフォン', 'LINE', 'アプリ'],
    date: '2024年8月20日（火）14:00-16:00',
    duration: '2時間',
    capacity: 10,
    price: 1800,
    location: {
      address: '大阪府豊中市服部本町2-5-6 服部コミュニティセンター',
      coordinates: {
        lat: 34.7550,
        lng: 135.4600
      }
    },
    rating: 4.6,
    reviewCount: 22,
    organizer: {
      id: 'teacher5',
      name: '松本智子',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'シニア向けのデジタル機器講座を専門に行っています。分かりやすい説明を心がけています。',
      rating: 4.7,
      reviewCount: 78,
      joinedDate: '2023年5月',
      verifiedStatus: true,
      specialties: ['スマートフォン', 'タブレット', 'デジタル機器']
    },
    reviews: [
      {
        id: 'r7',
        rating: 5,
        comment: 'LINEの使い方がよく分かりました。孫とのやり取りが楽しくなりそうです。',
        reviewerName: '小林春江',
        reviewerId: 'user7',
        date: '2024年7月28日',
        helpful: 8
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop'
    ],
    maxStudents: 10,
    currentBookings: 7,
    availableSlots: [
      {
        dayOfWeek: 2,
        startTime: '14:00',
        endTime: '16:00',
        isAvailable: true
      }
    ],
    videoURL: null,
    difficulty: 'beginner',
    targetAudience: ['シニア', 'スマートフォン初心者'],
    requirements: ['スマートフォン持参'],
    isActive: true,
    isApproved: true,
    viewCount: 145,
    favoriteCount: 28,
    createdAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-26')
  }
];

/**
 * サンプル活動データを取得（地図表示用）
 */
export function getSampleActivities(): SocialActivity[] {
  return SAMPLE_ACTIVITIES;
}

/**
 * IDで特定の活動を取得
 */
export function getSampleActivityById(id: string): SocialActivity | undefined {
  return SAMPLE_ACTIVITIES.find(activity => activity.id === id);
}
