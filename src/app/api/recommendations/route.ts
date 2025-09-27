// レコメンド機能API
import { NextRequest, NextResponse } from 'next/server'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { recommendationQuerySchema } from '@/lib/validations/schedule'
import { generateRecommendations } from '@/lib/helpers/recommendations'
import { ExtendedUserProfile } from '@/types/profile'
import { AvailabilityStatus } from '@/types/schedule'
import { Activity } from '@/types/recommendations'

// レコメンド取得
export async function GET(request: NextRequest) {
  try {
    // 認証確認 (開発中は簡易的にチェック)
    const authorization = request.headers.get('authorization')
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }

    // 開発用の簡易認証
    const user = {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'test'
    }

    // クエリパラメータの取得
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const sortBy = searchParams.get('sortBy')
    const limitParam = searchParams.get('limit')

    // バリデーション
    const validation = recommendationQuerySchema.safeParse({
      date: date || undefined,
      sortBy: sortBy || undefined,
      limit: limitParam ? parseInt(limitParam) : undefined
    })

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'クエリパラメータが無効です',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }

    const { date: targetDate, sortBy: sortOption, limit: resultLimit } = validation.data

    // ユーザープロフィールの取得
    const userProfile = await getUserProfile(user.uid)
    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'ユーザープロフィールが見つかりません' },
        { status: 404 }
      )
    }

    // その日の空き状況を取得
    const availability = await getUserAvailability(user.uid, targetDate)
    if (availability === 'none') {
      return NextResponse.json({
        success: true,
        data: {
          date: targetDate,
          userAvailability: availability,
          recommendations: [],
          total: 0
        }
      })
    }

    // 活動データの取得
    const activities = await getActivitiesForDate(targetDate)

    // レコメンド生成
    const recommendations = generateRecommendations(
      userProfile,
      activities,
      targetDate,
      availability
    )

    // ソートと制限
    let sortedRecommendations = recommendations

    switch (sortOption) {
      case 'distance':
        sortedRecommendations = recommendations.sort((a, b) =>
          (a.distance || 0) - (b.distance || 0)
        )
        break
      case 'time':
        sortedRecommendations = recommendations.sort((a, b) =>
          new Date(a.activity.start).getTime() - new Date(b.activity.start).getTime()
        )
        break
      case 'rating':
        sortedRecommendations = recommendations.sort((a, b) =>
          (b.activity.rating || 0) - (a.activity.rating || 0)
        )
        break
      case 'recommendation':
      default:
        // デフォルトでスコア順（既にソート済み）
        break
    }

    const limitedRecommendations = sortedRecommendations.slice(0, resultLimit)

    return NextResponse.json({
      success: true,
      data: {
        date: targetDate,
        userAvailability: availability,
        recommendations: limitedRecommendations,
        total: limitedRecommendations.length
      }
    })

  } catch (error) {
    console.error('レコメンド取得エラー:', error)
    return NextResponse.json(
      { success: false, error: 'レコメンドの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// ユーザープロフィールの取得
async function getUserProfile(uid: string): Promise<ExtendedUserProfile | null> {
  try {
    const profileRef = doc(db, 'users', uid)
    const profileSnap = await getDoc(profileRef)

    if (!profileSnap.exists()) {
      return null
    }

    const data = profileSnap.data()
    return {
      uid,
      displayName: data.displayName || '',
      bio: data.bio || '',
      home: data.home || null,
      interests: data.interests || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  } catch (error) {
    console.error('ユーザープロフィール取得エラー:', error)
    return null
  }
}

// ユーザーの空き状況取得
async function getUserAvailability(uid: string, date: string): Promise<AvailabilityStatus> {
  try {
    const availabilityRef = doc(db, 'users', uid, 'availability', date)
    const availabilitySnap = await getDoc(availabilityRef)

    if (!availabilitySnap.exists()) {
      // デフォルトは利用不可
      return 'none'
    }

    return availabilitySnap.data().status as AvailabilityStatus
  } catch (error) {
    console.error('空き状況取得エラー:', error)
    return 'none'
  }
}

// 指定日の活動取得
async function getActivitiesForDate(date: string): Promise<Activity[]> {
  try {
    // 指定日の開始・終了時刻
    const startOfDay = `${date}T00:00:00+09:00`
    const endOfDay = `${date}T23:59:59+09:00`

    const activitiesRef = collection(db, 'activities')
    const q = query(
      activitiesRef,
      where('start', '>=', startOfDay),
      where('start', '<=', endOfDay),
      orderBy('start'),
      firestoreLimit(100) // 最大100件
    )

    const querySnapshot = await getDocs(q)
    const activities: Activity[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      activities.push({
        id: doc.id,
        title: data.title,
        category: data.category,
        tags: data.tags || [],
        start: data.start,
        end: data.end,
        location: data.location,
        org: data.org,
        cost: data.cost,
        url: data.url,
        rating: data.rating,
        description: data.description,
        maxParticipants: data.maxParticipants,
        currentParticipants: data.currentParticipants || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      })
    })

    return activities
  } catch (error) {
    console.error('活動データ取得エラー:', error)
    return []
  }
}