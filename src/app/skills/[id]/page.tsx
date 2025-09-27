'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Share2,
  Calendar,
  MessageSquare,
  ChevronLeft,
  Award,
  Shield,
  CheckCircle,
  AlertCircle,
  Camera,
  Play,
  ExternalLink,
  Phone,
  Mail,
  ThumbsUp,
  Flag,
  BookOpen,
  TrendingUp,
  Target,
  Globe,
  Video,
  FileText,
  BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skill, SkillReview, SkillCategory } from '@/types/skill'
import { Loading } from '@/components/Loading'
import { generateToyonakaSampleSkills } from '@/lib/sampleDataToyonaka'

// 日本語カテゴリをSkillCategoryにマッピング
const mapCategoryToEnum = (japaneseCategory: string): SkillCategory => {
  const categoryMap: Record<string, SkillCategory> = {
    '料理・お菓子作り': SkillCategory.COOKING,
    '園芸・ガーデニング': SkillCategory.GARDENING,
    '手芸・裁縫': SkillCategory.HANDICRAFT,
    '楽器演奏': SkillCategory.MUSIC,
    'パソコン・スマホ': SkillCategory.TECHNOLOGY,
    '語学': SkillCategory.LANGUAGE,
    '書道・絵画': SkillCategory.ART,
    '健康・体操': SkillCategory.HEALTH,
    'その他': SkillCategory.OTHER
  }

  return categoryMap[japaneseCategory] || SkillCategory.OTHER
}

// スキル内容に応じた適切な写真URLを取得
const getSkillImage = (title: string, category: string, tags: string[]): string => {
  // スキルタイトルやタグから具体的な画像を選択
  const title_lower = title.toLowerCase()
  const tags_text = tags.join(' ').toLowerCase()

  // 具体的なスキルに応じた画像マッピング
  if (title_lower.includes('ピアノ') || tags_text.includes('ピアノ')) {
    return 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80' // ピアノ
  }
  if (title_lower.includes('編み物') || tags_text.includes('編み物')) {
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' // 編み物
  }
  if (title_lower.includes('パソコン') || title_lower.includes('デジタル') || tags_text.includes('パソコン')) {
    return 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80' // パソコン教室
  }
  if (title_lower.includes('茶道') || tags_text.includes('茶道')) {
    return 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80' // 茶道
  }
  if (title_lower.includes('料理') || title_lower.includes('パン') || tags_text.includes('料理')) {
    return 'https://images.unsplash.com/photo-1556909114-5c0e7ac17bba?w=800&q=80' // 料理教室
  }
  if (title_lower.includes('ガーデニング') || title_lower.includes('野菜') || tags_text.includes('ガーデニング')) {
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80' // ガーデニング
  }
  if (title_lower.includes('書道') || title_lower.includes('美文字') || tags_text.includes('書道')) {
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80' // 書道
  }
  if (title_lower.includes('英会話') || title_lower.includes('語学') || tags_text.includes('英会話')) {
    return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80' // 語学学習
  }
  if (title_lower.includes('将棋') || title_lower.includes('囲碁') || tags_text.includes('将棋')) {
    return 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80' // 将棋・囲碁
  }
  if (title_lower.includes('ヨガ') || title_lower.includes('太極拳') || title_lower.includes('体操') || tags_text.includes('ヨガ')) {
    return 'https://images.unsplash.com/photo-1506629905607-84d5504e862b?w=800&q=80' // ヨガ・体操
  }
  if (title_lower.includes('洋裁') || title_lower.includes('手芸') || tags_text.includes('洋裁')) {
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' // 手芸・裁縫
  }
  if (title_lower.includes('写真') || title_lower.includes('カメラ') || tags_text.includes('写真')) {
    return 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80' // 写真撮影
  }
  if (title_lower.includes('フラワーアレンジメント') || title_lower.includes('花') || tags_text.includes('フラワーアレンジメント')) {
    return 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80' // フラワーアレンジメント
  }
  if (title_lower.includes('diy') || title_lower.includes('木工') || tags_text.includes('diy')) {
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80' // DIY・木工
  }
  if (title_lower.includes('着付け') || title_lower.includes('着物') || tags_text.includes('着付け')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80' // 着物・着付け
  }
  if (title_lower.includes('歌唱') || title_lower.includes('カラオケ') || tags_text.includes('歌唱')) {
    return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80' // 歌唱・カラオケ
  }
  if (title_lower.includes('算数') || title_lower.includes('数学') || tags_text.includes('算数')) {
    return 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80' // 数学・算数
  }

  // カテゴリベースのフォールバック
  const categoryImageMap: Record<string, string> = {
    '料理・お菓子作り': 'https://images.unsplash.com/photo-1556909114-5c0e7ac17bba?w=800&q=80',
    '園芸・ガーデニング': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    '手芸・裁縫': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    '楽器演奏': 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80',
    'パソコン・スマホ': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    '語学': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    '書道・絵画': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    '健康・体操': 'https://images.unsplash.com/photo-1506629905607-84d5504e862b?w=800&q=80',
    'その他': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'
  }

  return categoryImageMap[category] || categoryImageMap['その他']
}

// 豊中市のスキルデータをSkill型に変換
const convertToSkillType = (toyonakaSkill: any): Skill => {
  return {
    id: toyonakaSkill.id,
    title: toyonakaSkill.title,
    shortDescription: toyonakaSkill.description.substring(0, 100) + '...',
    description: toyonakaSkill.description,
    category: mapCategoryToEnum(toyonakaSkill.category),
    difficulty: toyonakaSkill.difficulty,
    pricing: {
      type: 'per_session',
      amount: toyonakaSkill.price,
      currency: 'JPY',
      unit: '回'
    },
    teacherId: toyonakaSkill.teacherId,
    subCategory: toyonakaSkill.category,
    targetAudience: ['シニア', '初心者'],
    isActive: toyonakaSkill.isActive,
    isApproved: true,
    isFeatured: false,
    schedule: {
      type: 'flexible' as const,
      availableSlots: [{
        dayOfWeek: 1,
        startTime: '10:00',
        endTime: '16:00',
        isAvailable: true
      }]
    },
    duration: {
      typical: toyonakaSkill.duration,
      minimum: toyonakaSkill.duration - 30,
      maximum: toyonakaSkill.duration + 30,
      flexible: true
    },
    capacity: {
      maxStudents: toyonakaSkill.maxStudents,
      minStudents: 1,
      currentBookings: toyonakaSkill.currentStudents,
      waitingList: 0
    },
    location: {
      type: toyonakaSkill.isOnline ? 'online' : 'offline',
      address: toyonakaSkill.location,
      coordinates: {
        lat: toyonakaSkill.coordinates.latitude,
        lng: toyonakaSkill.coordinates.longitude
      }
    },
    ageRange: {
      min: 50,
      max: 80,
      description: '50歳以上推奨'
    },
    teacher: {
      id: toyonakaSkill.teacher.id,
      name: toyonakaSkill.teacher.displayName,
      displayName: toyonakaSkill.teacher.displayName,
      photoURL: toyonakaSkill.teacher.photoURL,
      bio: toyonakaSkill.teacher.bio,
      location: toyonakaSkill.teacher.location,
      joinedDate: toyonakaSkill.teacher.createdAt,
      teachingExperience: Math.floor(Math.random() * 10) + 5,
      specialties: toyonakaSkill.teacher.skills,
      languages: ['日本語'],
      rating: {
        average: toyonakaSkill.teacher.rating,
        count: toyonakaSkill.teacher.reviewCount,
        asTeacher: toyonakaSkill.teacher.rating
      },
      verificationStatus: {
        isEmailVerified: true,
        isPhoneVerified: true,
        isDocumentVerified: true
      }
    },
    images: toyonakaSkill.images.length > 0 ? toyonakaSkill.images : [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
    ],
    rating: {
      average: toyonakaSkill.rating,
      count: toyonakaSkill.reviewCount,
      distribution: { 5: Math.floor(toyonakaSkill.reviewCount * 0.6), 4: Math.floor(toyonakaSkill.reviewCount * 0.3), 3: Math.floor(toyonakaSkill.reviewCount * 0.1), 2: 0, 1: 0 }
    },
    reviews: [
      {
        id: `review-${toyonakaSkill.id}-1`,
        skillId: toyonakaSkill.id,
        studentId: 'student1',
        student: {
          name: '山田 太郎',
          photoURL: undefined,
          verifiedStatus: true
        },
        rating: 5,
        title: '丁寧な指導で安心',
        comment: '分かりやすく教えていただき、とても勉強になりました。また参加したいと思います。',
        pros: ['分かりやすい説明', '丁寧な指導', 'アットホームな雰囲気'],
        cons: [],
        createdAt: new Date('2024-01-15'),
        helpfulCount: 5,
        wouldRecommend: true,
        reportedCount: 0,
        updatedAt: new Date('2024-01-15')
      }
    ],
    prerequisites: [
      'やる気があればどなたでも参加できます',
      '必要な道具は事前にお知らせします'
    ],
    materials: [
      '筆記用具',
      'ノート'
    ],
    tags: toyonakaSkill.tags,
    statistics: {
      viewCount: Math.floor(Math.random() * 1000) + 500,
      favoriteCount: Math.floor(Math.random() * 50) + 20,
      bookingCount: toyonakaSkill.reviewCount + Math.floor(Math.random() * 50),
      completionRate: 95 + Math.floor(Math.random() * 5),
      repeatCustomerRate: 70 + Math.floor(Math.random() * 20)
    },
    isAvailableForBooking: true,
    createdAt: toyonakaSkill.createdAt,
    updatedAt: toyonakaSkill.updatedAt
  }
}

// モックデータ - 実際の実装ではAPIから取得
const getMockSkill = (id: string): Skill | null => {
  // 豊中市のスキルデータに対応（簡略化版）
  if (id.startsWith('toyonaka-skill-')) {
    const toyonakaSkills = generateToyonakaSampleSkills()
    const skill = toyonakaSkills.find(s => s.id === id)

    if (skill) {
      return {
        id: skill.id,
        title: skill.title,
        shortDescription: skill.description.substring(0, 100) + '...',
        description: skill.description,
        category: mapCategoryToEnum(skill.category),
        difficulty: skill.difficulty as 'beginner' | 'intermediate' | 'advanced',
        pricing: {
          type: 'per_session' as const,
          amount: skill.price,
          currency: 'JPY',
          unit: '回'
        },
        teacherId: skill.teacherId,
        subCategory: skill.category,
        targetAudience: ['シニア', '初心者'],
        isActive: skill.isActive,
        isApproved: true,
        isFeatured: false,
        schedule: {
          type: 'flexible' as const,
          availableSlots: [{
            dayOfWeek: 1,
            startTime: '10:00',
            endTime: '16:00',
            isAvailable: true
          }]
        },
        duration: {
          typical: skill.duration,
          minimum: skill.duration - 30,
          maximum: skill.duration + 30,
          flexible: true
        },
        capacity: {
          maxStudents: skill.maxStudents,
          minStudents: 1,
          currentBookings: skill.currentStudents,
          waitingList: 0
        },
        location: {
          type: skill.isOnline ? 'online' as const : 'offline' as const,
          address: skill.location,
          coordinates: {
            lat: skill.coordinates.latitude,
            lng: skill.coordinates.longitude
          }
        },
        ageRange: {
          min: 50,
          max: 80,
          description: '50歳以上推奨'
        },
        teacher: {
          id: skill.teacher.id,
          name: skill.teacher.displayName,
          displayName: skill.teacher.displayName,
          photoURL: skill.teacher.photoURL,
          bio: skill.teacher.bio,
          location: skill.teacher.location,
          joinedDate: skill.teacher.createdAt,
          verificationStatus: {
            isEmailVerified: true,
            isPhoneVerified: true,
            isDocumentVerified: true
          },
          rating: {
            average: skill.teacher.rating,
            count: skill.teacher.reviewCount,
            asTeacher: skill.teacher.rating
          },
          teachingExperience: Math.floor(Math.random() * 10) + 5,
          specialties: skill.teacher.skills,
          languages: ['日本語']
        },
        images: [getSkillImage(skill.title, skill.category, skill.tags)],
        rating: {
          average: skill.rating,
          count: skill.reviewCount,
          distribution: { 5: Math.floor(skill.reviewCount * 0.6), 4: Math.floor(skill.reviewCount * 0.3), 3: Math.floor(skill.reviewCount * 0.1), 2: 0, 1: 0 }
        },
        reviews: [
          {
            id: `review-${skill.id}-1`,
            skillId: skill.id,
            studentId: 'student1',
            student: {
              name: '山田 太郎',
              photoURL: undefined,
              verifiedStatus: true
            },
            rating: 5,
            title: '丁寧な指導で安心',
            comment: '分かりやすく教えていただき、とても勉強になりました。また参加したいと思います。',
            pros: ['分かりやすい説明', '丁寧な指導', 'アットホームな雰囲気'],
            cons: [],
            createdAt: new Date('2024-01-15'),
            helpfulCount: 5,
            wouldRecommend: true,
            reportedCount: 0,
            updatedAt: new Date('2024-01-15')
          }
        ],
        prerequisites: [
          'やる気があればどなたでも参加できます',
          '必要な道具は事前にお知らせします'
        ],
        materials: [
          '筆記用具',
          'ノート'
        ],
        tags: skill.tags,
        statistics: {
          viewCount: Math.floor(Math.random() * 1000) + 500,
          favoriteCount: Math.floor(Math.random() * 50) + 20,
          bookingCount: skill.reviewCount + Math.floor(Math.random() * 50),
          completionRate: 95 + Math.floor(Math.random() * 5),
          repeatCustomerRate: 70 + Math.floor(Math.random() * 20)
        },
        isAvailableForBooking: true,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt
      }
    }
  }

  // サンプルスキルデータ
  const sampleSkills: Record<string, Skill> = {
    '1': {
      id: '1',
      title: '初心者向けお料理教室',
      shortDescription: '包丁の持ち方から始める、お料理の基礎を楽しく学べます',
      description: `お料理が初めての方でも安心して参加いただける、基礎的なお料理教室です。

包丁の持ち方から始まり、食材の切り方、火の通し方など、お料理の基本的なテクニックを丁寧にお教えします。

毎回異なるメニューを作りながら、自然とお料理のスキルが身につきます。作った料理はその場でお召し上がりいただけるので、美味しく楽しく学べます。

アットホームな雰囲気で、他の参加者の方々と交流しながら、お料理の楽しさを味わってください。`,
      category: SkillCategory.COOKING,
      difficulty: 'beginner',
      pricing: {
        type: 'per_session',
        amount: 3500,
        currency: 'JPY',
        unit: '回'
      },
      teacherId: '1',
      subCategory: '基礎料理',
      targetAudience: ['シニア', '初心者'],
      isActive: true,
      isApproved: true,
      isFeatured: false,
      schedule: {
        type: 'flexible' as const,
        availableSlots: [{
          dayOfWeek: 1,
          startTime: '10:00',
          endTime: '16:00',
          isAvailable: true
        }]
      },
      duration: {
        typical: 120,
        minimum: 90,
        maximum: 150,
        flexible: true
      },
      capacity: {
        maxStudents: 6,
        minStudents: 1,
        currentBookings: 2,
        waitingList: 0
      },
      location: {
        type: 'offline',
        address: '東京都世田谷区三軒茶屋',
        coordinates: {
          lat: 35.6434,
          lng: 139.6690
        }
      },
      ageRange: {
        min: 50,
        max: 80,
        description: '50歳以上推奨'
      },
      teacher: {
        id: '1',
        name: '田中 花子',
        displayName: '田中 花子',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        bio: `料理歴30年、元料理教室講師です。
特に家庭料理を得意としており、シニアの方々に分かりやすく、楽しく料理を教えることを心がけています。

これまで500名以上の生徒さんにお料理を教えてきました。お料理を通じて、生活に彩りと健康をお届けしたいと思っています。`,
        location: '世田谷区',
        joinedDate: new Date('2020-01-01'),
        teachingExperience: 8,
        specialties: ['家庭料理', '和食', '健康料理'],
        languages: ['日本語'],
        rating: {
          average: 4.8,
          count: 24,
          asTeacher: 4.8
        },
        verificationStatus: {
          isEmailVerified: true,
          isPhoneVerified: true,
          isDocumentVerified: true
        }
      },
      images: [
        'https://images.unsplash.com/photo-1556909114-5c0e7ac17bba?w=800&q=80',
        'https://images.unsplash.com/photo-1556908636-6d5bf8dd0a68?w=800',
        'https://images.unsplash.com/photo-1556909010-4e85bc21cd8c?w=800'
      ],
      rating: {
        average: 4.7,
        count: 28,
        distribution: { 5: 18, 4: 8, 3: 2, 2: 0, 1: 0 }
      },
      reviews: [
        {
          id: 'review1',
          skillId: '1',
          studentId: 'student1',
          student: {
            name: '山田 太郎',
            photoURL: undefined,
            verifiedStatus: true
          },
          rating: 5,
          title: '丁寧な指導で安心',
          comment: '全くの初心者でしたが、田中先生が丁寧に教えてくださり、美味しい料理を作ることができました。他の参加者の方々とも楽しく交流できて、とても良い時間でした。',
          pros: ['分かりやすい説明', '丁寧な指導', 'アットホームな雰囲気'],
          cons: [],
          createdAt: new Date('2024-01-15'),
          helpfulCount: 5,
          wouldRecommend: true,
          reportedCount: 0,
          updatedAt: new Date('2024-01-10')
        },
        {
          id: 'review2',
          skillId: '1',
          studentId: 'student2',
          student: {
            name: '佐藤太郎',
            photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            verifiedStatus: true
          },
          rating: 5,
          title: '料理が楽しくなりました',
          comment: '包丁の持ち方から教えていただき、基本からしっかり学べました。毎回違うメニューで飽きることなく、料理の幅が広がりました。',
          pros: ['基礎から学べる', '毎回違うメニュー', '美味しい'],
          cons: [],
          createdAt: new Date('2024-01-10'),
          helpfulCount: 3,
          wouldRecommend: true,
          reportedCount: 0,
          updatedAt: new Date('2024-01-10')
        }
      ],
      prerequisites: [
        'エプロンと三角巾をお持ちください',
        '手洗い・消毒にご協力ください',
        '食物アレルギーがある場合は事前にお知らせください'
      ],
      materials: [
        'エプロン',
        '三角巾',
        'ハンドタオル'
      ],
      tags: ['初心者歓迎', '基礎から学べる', '少人数制', '楽しい'],
      statistics: {
        viewCount: 1240,
        favoriteCount: 89,
        bookingCount: 156,
        completionRate: 95,
        repeatCustomerRate: 78
      },
      isAvailableForBooking: true,
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2024-01-15')
    },
    '2': {
      id: '2',
      title: 'ベランダでできる簡単ガーデニング',
      shortDescription: '限られたスペースでも楽しめる、シニア向けガーデニング講座',
      description: `マンションのベランダや小さなお庭でも楽しめるガーデニングを教えます。

シニアの方でも無理なく続けられる、簡単で楽しいガーデニングの方法をお教えします。季節の花や野菜を育てて、生活に彩りを加えませんか？

プランターを使った栽培方法から、水やりのコツ、肥料の与え方まで、基本的なことから丁寧にお教えします。`,
      category: SkillCategory.GARDENING,
      difficulty: 'beginner',
      teacherId: '1',
      subCategory: '基礎料理',
      targetAudience: ['シニア', '初心者'],
      isActive: true,
      isApproved: true,
      isFeatured: false,
      pricing: {
        type: 'per_session',
        amount: 2500,
        currency: 'JPY',
        unit: '回'
      },
      schedule: {
        type: 'flexible' as const,
        availableSlots: [{
          dayOfWeek: 6,
          startTime: '09:00',
          endTime: '12:00',
          isAvailable: true
        }]
      },
      duration: {
        typical: 90,
        minimum: 60,
        maximum: 120,
        flexible: true
      },
      capacity: {
        maxStudents: 4,
        minStudents: 1,
        currentBookings: 1,
        waitingList: 0
      },
      location: {
        type: 'offline',
        address: '神奈川県川崎市多摩区',
        coordinates: {
          lat: 35.6221,
          lng: 139.5463
        }
      },
      ageRange: {
        min: 60,
        max: 85,
        description: '60歳以上推奨'
      },
      teacher: {
        id: '2',
        name: '佐藤 一郎',
        displayName: '佐藤 一郎',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        bio: `ガーデニング歴20年、園芸療法士の資格を持っています。
小さなスペースでも楽しめるガーデニングを通じて、シニアの方々の生活に潤いをお届けしたいと思っています。`,
        location: '川崎市',
        joinedDate: new Date('2019-06-01'),
        teachingExperience: 5,
        specialties: ['ベランダガーデニング', '野菜栽培', '園芸療法'],
        languages: ['日本語'],
        rating: {
          average: 4.9,
          count: 18,
          asTeacher: 4.9
        },
        verificationStatus: {
          isEmailVerified: true,
          isPhoneVerified: true,
          isDocumentVerified: true
        }
      },
      images: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800'
      ],
      rating: {
        average: 4.6,
        count: 15,
        distribution: { 5: 9, 4: 5, 3: 1, 2: 0, 1: 0 }
      },
      reviews: [
        {
          id: 'review3',
          skillId: '2',
          studentId: 'student3',
          student: {
            name: '高橋 良子',
            photoURL: undefined,
            verifiedStatus: true
          },
          rating: 5,
          title: 'ベランダが生き生きとしました',
          comment: '狭いベランダでも、こんなにたくさんの植物が育てられるとは思いませんでした。先生の指導のおかげで、毎日水やりが楽しみになりました。',
          pros: ['実践的なアドバイス', '親切な指導'],
          cons: [],
          createdAt: new Date('2024-01-12'),
          helpfulCount: 4,
          wouldRecommend: true,
          reportedCount: 0,
          updatedAt: new Date('2024-01-12')
        }
      ],
      prerequisites: [
        '汚れても良い服装でお越しください',
        '軍手をお持ちください'
      ],
      materials: [
        '軍手',
        'タオル',
        '水分補給用の飲み物'
      ],
      tags: ['初心者歓迎', 'ベランダ', '療養効果', '少人数'],
      statistics: {
        viewCount: 890,
        favoriteCount: 67,
        bookingCount: 89,
        completionRate: 98,
        repeatCustomerRate: 85
      },
      isAvailableForBooking: true,
      createdAt: new Date('2023-11-15'),
      updatedAt: new Date('2024-01-12')
    }
  }
  
  return sampleSkills[id] || null
}

export default function SkillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const skillId = params.id as string

  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'teacher'>('overview')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [reviewSortBy, setReviewSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const [showAllReviews, setShowAllReviews] = useState(false)

  // データ取得
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // TODO: 実際のAPI呼び出し
        // const skillData = await getSkillById(skillId)
        const skillData = getMockSkill(skillId)
        
        if (!skillData) {
          setError('スキルが見つかりませんでした')
          return
        }
        
        setSkill(skillData)
      } catch (err) {
        setError('スキルの読み込みに失敗しました')
        console.error('Skill fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (skillId) {
      fetchSkill()
    }
  }, [skillId])

  // お気に入り切り替え
  const handleFavoriteToggle = async () => {
    try {
      // TODO: API呼び出し
      // await toggleFavoriteSkill(skillId, !isFavorite)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Favorite toggle error:', error)
    }
  }

  // 共有機能
  const handleShare = async () => {
    if (typeof window === 'undefined') return

    if (navigator.share) {
      try {
        await navigator.share({
          title: skill?.title,
          text: skill?.shortDescription || skill?.description,
          url: typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://bivid.app'}/skills/${skill?.id}`
        })
      } catch (error) {
        console.error('Share error:', error)
      }
    } else {
      // フォールバック: クリップボードにコピー
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
      }
      alert('リンクをクリップボードにコピーしました')
    }
  }

  // 予約処理
  const handleBooking = () => {
    // 予約ページに遷移
    router.push(`/skills/${skillId}/booking`)
  }

  // 相談処理
  const handleContact = () => {
    // メッセージページに遷移
    router.push('/messages')
  }

  // レビューのソート処理
  const getSortedReviews = () => {
    if (!skill?.reviews) return []
    
    const sorted = [...skill.reviews].sort((a, b) => {
      switch (reviewSortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default:
          return 0
      }
    })
    
    return showAllReviews ? sorted : sorted.slice(0, 3)
  }

  // レビューの「参考になった」処理
  const handleReviewHelpful = async (reviewId: string) => {
    try {
      // TODO: API呼び出し
      console.log('Mark review as helpful:', reviewId)
    } catch (error) {
      console.error('Review helpful error:', error)
    }
  }

  // レビューの報告処理
  const handleReviewReport = async (reviewId: string) => {
    try {
      // TODO: API呼び出し
      console.log('Report review:', reviewId)
      alert('レビューを報告しました')
    } catch (error) {
      console.error('Review report error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'スキルが見つかりません'}
          </h1>
          <p className="text-gray-600 mb-4">
            お探しのスキルは削除されたか、URLが間違っている可能性があります。
          </p>
          <Button onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  const categoryConfig = { name: skill.category, color: 'bg-blue-500', icon: '🍳' }
  const priceDisplay = skill.pricing.amount === 0 
    ? '無料' 
    : `¥${skill.pricing.amount.toLocaleString()}/${skill.pricing.unit}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {skill.title}
                </h1>
                <p className="text-sm text-gray-600">
                  by {skill.teacher.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFavoriteToggle}
                className={isFavorite ? 'text-red-600' : 'text-gray-600'}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                お気に入り
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                共有
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 画像ギャラリー */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {skill.images.length > 0 ? (
                <div>
                  <div className="aspect-video relative">
                    <img
                      src={skill.images[selectedImageIndex]}
                      alt={skill.title}
                      className="w-full h-full object-cover"
                    />
                    {skill.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {skill.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {skill.images.length > 1 && (
                    <div className="p-4 flex space-x-2 overflow-x-auto">
                      {skill.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            index === selectedImageIndex ? 'border-orange-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${skill.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">画像がありません</p>
                  </div>
                </div>
              )}
            </div>

            {/* タブナビゲーション */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: '概要', icon: <Star className="w-4 h-4" /> },
                    { id: 'reviews', label: 'レビュー', icon: <MessageSquare className="w-4 h-4" /> },
                    { id: 'teacher', label: '講師情報', icon: <Users className="w-4 h-4" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.id === 'overview' ? '概要' : tab.id === 'reviews' ? 'レビュー' : tab.id === 'teacher' ? '講師情報' : tab.id}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* 概要タブ */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">スキルについて</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {skill.description}
                      </p>
                    </div>

                    {skill.prerequisites.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">必要な条件</h3>
                        <ul className="space-y-2">
                          {skill.prerequisites.map((req, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {skill.materials.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">必要な材料・道具</h3>
                        <ul className="space-y-2">
                          {skill.materials.map((material, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {skill.videos && skill.videos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">紹介動画</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {skill.videos.map((video, index) => (
                            <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <Play className="w-12 h-12 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* レビュータブ */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        レビュー ({skill.rating.count}件)
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-lg font-semibold text-gray-900">
                            {skill.rating.average.toFixed(1)}
                          </span>
                        </div>
                        <select
                          value={reviewSortBy}
                          onChange={(e) => setReviewSortBy(e.target.value as any)}
                          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="newest">新しい順</option>
                          <option value="oldest">古い順</option>
                          <option value="highest">評価の高い順</option>
                          <option value="lowest">評価の低い順</option>
                        </select>
                      </div>
                    </div>

                    {/* 評価分布 */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = skill.rating.distribution[rating as keyof typeof skill.rating.distribution] || 0
                        const percentage = skill.rating.count > 0 ? (count / skill.rating.count) * 100 : 0
                        
                        return (
                          <div key={rating} className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* レビュー一覧 */}
                    <div className="space-y-4">
                      {getSortedReviews().map(review => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {review.student.photoURL ? (
                                <img
                                  src={review.student.photoURL}
                                  alt={review.student.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-600">
                                  {review.student.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium text-gray-900">{review.student.name}</p>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {review.title && (
                                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                              )}
                              
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              
                              {(review.pros?.length || review.cons?.length) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {review.pros && review.pros.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium text-green-700 mb-2">良かった点</h5>
                                      <ul className="space-y-1">
                                        {review.pros.map((pro, index) => (
                                          <li key={index} className="text-sm text-gray-700 flex items-start space-x-1">
                                            <span className="text-green-500">+</span>
                                            <span>{pro}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {review.cons && review.cons.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium text-red-700 mb-2">改善点</h5>
                                      <ul className="space-y-1">
                                        {review.cons.map((con, index) => (
                                          <li key={index} className="text-sm text-gray-700 flex items-start space-x-1">
                                            <span className="text-red-500">-</span>
                                            <span>{con}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <button
                                    onClick={() => handleReviewHelpful(review.id)}
                                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>参考になった ({review.helpfulCount})</span>
                                  </button>
                                  {review.wouldRecommend && (
                                    <span className="text-green-600 flex items-center space-x-1">
                                      <CheckCircle className="w-4 h-4" />
                                      <span>おすすめします</span>
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleReviewReport(review.id)}
                                  className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-1"
                                >
                                  <Flag className="w-4 h-4" />
                                  <span>報告</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {skill.reviews.length > 3 && (
                      <div className="text-center">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                          {showAllReviews ? 'レビューを折りたたむ' : `すべてのレビューを見る (${skill.reviews.length - 3}件)`}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* 講師情報タブ */}
                {activeTab === 'teacher' && (
                  <div className="space-y-6">
                    {/* 講師プロフィール */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                          {skill.teacher.photoURL ? (
                            <img
                              src={skill.teacher.photoURL}
                              alt={skill.teacher.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-medium text-gray-600">
                              {skill.teacher.name.charAt(0)}
                            </span>
                          )}
                          {skill.teacher.verificationStatus.isDocumentVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                              <BadgeCheck className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {skill.teacher.name}
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <div>
                                <span className="font-semibold text-lg">{skill.teacher.rating.average.toFixed(1)}</span>
                                <span className="text-gray-600 ml-1">({skill.teacher.rating.count}件)</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-5 h-5 text-blue-500" />
                              <div>
                                <span className="font-semibold">{skill.teacher.teachingExperience}年</span>
                                <span className="text-gray-600 ml-1">指導歴</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-5 h-5 text-green-500" />
                              <span className="font-medium">{skill.teacher.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>参加日: {new Date(skill.teacher.joinedDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>レッスン回数: {skill.statistics.bookingCount}回</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {skill.teacher.bio && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">自己紹介</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {skill.teacher.bio}
                        </p>
                      </div>
                    )}

                    {skill.teacher.specialties.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">専門分野</h4>
                        <div className="flex flex-wrap gap-2">
                          {skill.teacher.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skill.teacher.languages.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Globe className="w-5 h-5 mr-2 text-blue-500" />
                          対応言語
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skill.teacher.languages.map((language: string) => (
                            <span
                              key={language}
                              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 講師の実績・統計 */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                        実績・統計
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{skill.statistics.completionRate}%</div>
                          <div className="text-sm text-gray-600">完了率</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">{skill.statistics.repeatCustomerRate}%</div>
                          <div className="text-sm text-gray-600">リピート率</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">{skill.statistics.bookingCount}</div>
                          <div className="text-sm text-gray-600">総レッスン数</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-orange-600">{skill.statistics.favoriteCount}</div>
                          <div className="text-sm text-gray-600">お気に入り数</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 連絡先・アクション */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">講師に連絡</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                          variant="secondary"
                          onClick={handleContact}
                          className="flex items-center justify-center"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          メッセージを送る
                        </Button>
                        <Button
                          onClick={handleBooking}
                          className="flex items-center justify-center"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          レッスンを予約
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 予約カード */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-24">
              {/* 価格表示 */}
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold mb-1">
                    {priceDisplay}
                  </div>
                  {skill.pricing.amount > 0 && (
                    <p className="text-orange-100 text-sm">1回あたりの料金</p>
                  )}
                </div>
                
                {/* 評価表示 */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(skill.rating.average) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{skill.rating.average.toFixed(1)}</span>
                  <span className="text-gray-600">({skill.rating.count}件)</span>
                </div>
              </div>

              {/* スキル詳細情報 */}
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">{skill.duration.typical}分</div>
                      <div className="text-sm text-gray-600">{skill.duration.minimum}〜{skill.duration.maximum}分で調整可能</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {skill.location.type === 'online' ? 'オンライン' : 
                         skill.location.type === 'offline' ? '対面レッスン' : 'ハイブリッド'}
                      </div>
                      {skill.location.address && (
                        <div className="text-sm text-gray-600">{skill.location.address}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900">最大{skill.capacity.maxStudents}名</div>
                      <div className="text-sm text-gray-600">
                        {skill.capacity.currentBookings > 0 ? (
                          <span className="text-orange-600">残り{skill.capacity.maxStudents - skill.capacity.currentBookings}名</span>
                        ) : (
                          <span className="text-green-600">空きあり</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="space-y-3">
                <Button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg"
                  disabled={!skill.isAvailableForBooking}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {skill.isAvailableForBooking ? 'レッスンを予約する' : '予約受付停止中'}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={handleContact}
                  className="w-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 font-medium py-2"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  講師に質問する
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={handleFavoriteToggle}
                    className={`flex-1 ${isFavorite ? 'bg-red-50 text-red-600 border-red-200' : 'border-gray-300'}`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'お気に入り済み' : 'お気に入り'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handleShare}
                    className="flex-1 border-gray-300"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    共有
                  </Button>
                </div>
              </div>
              
              {/* 安心・安全情報 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600 mb-3">
                  <Shield className="w-4 h-4 inline mr-1" />
                  安心・安全への取り組み
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  {skill.teacher.verificationStatus.isDocumentVerified && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>身元確認済み講師</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>レッスン前の事前相談可能</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>キャンセル・返金対応</span>
                  </div>
                </div>
              </div>
            </div>

            {/* スキル詳細情報 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-500" />
                スキル詳細
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-sm text-blue-600 font-medium">カテゴリ</span>
                  <p className="font-semibold text-blue-900">{categoryConfig?.name}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <span className="text-sm text-green-600 font-medium">難易度</span>
                  <p className="font-semibold text-green-900">
                    {skill.difficulty === 'beginner' ? '🟢 初級者向け' :
                     skill.difficulty === 'intermediate' ? '🟡 中級者向け' :
                     skill.difficulty === 'advanced' ? '🔴 上級者向け' : '🔵 すべてのレベル'}
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3">
                  <span className="text-sm text-purple-600 font-medium">対象年齢</span>
                  <p className="font-semibold text-purple-900">{skill.ageRange.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-orange-600">{skill.statistics.bookingCount}</div>
                    <div className="text-xs text-orange-700">総レッスン数</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-red-600">{skill.statistics.favoriteCount}</div>
                    <div className="text-xs text-red-700">お気に入り数</div>
                  </div>
                </div>
                
                {/* タグ表示 */}
                {skill.tags && skill.tags.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 font-medium mb-2 block">特徴</span>
                    <div className="flex flex-wrap gap-1">
                      {skill.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 講師の実績サマリー */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                講師の実績
              </h3>
              
              <div className="space-y-4">
                {/* 講師プロフィール簡易版 */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {skill.teacher.photoURL ? (
                      <img
                        src={skill.teacher.photoURL}
                        alt={skill.teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {skill.teacher.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{skill.teacher.name}</p>
                    <p className="text-sm text-gray-600">指導歴 {skill.teacher.teachingExperience}年</p>
                  </div>
                </div>
                
                {/* 実績指標 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">{skill.statistics.completionRate}%</div>
                    <div className="text-xs text-blue-700">完了率</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-600">{skill.statistics.repeatCustomerRate}%</div>
                    <div className="text-xs text-green-700">リピート率</div>
                  </div>
                </div>
                
                {/* 認証状況 */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-blue-500" />
                    認証状況
                  </div>
                  <div className="space-y-1">
                    {skill.teacher.verificationStatus.isEmailVerified && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-700">メール認証</span>
                      </div>
                    )}
                    {skill.teacher.verificationStatus.isPhoneVerified && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-700">電話番号認証</span>
                      </div>
                    )}
                    {skill.teacher.verificationStatus.isDocumentVerified && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-700">身元確認</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}