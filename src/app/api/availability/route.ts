// スケジュール管理API
import { NextRequest, NextResponse } from 'next/server'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  query,
  where,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  monthQuerySchema,
  batchAvailabilityUpdateSchema,
  validateDate
} from '@/lib/validations/schedule'
import { AvailabilityStatus, DailyAvailability } from '@/types/schedule'

// 月間スケジュール取得
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

    // 開発中は簡易的にuidを抽出（実際の本番環境では適切なトークン検証が必要）
    const token = authorization.substring(7)

    // TODO: 本番環境では verifyIdToken を使用
    // const decodedToken = await verifyIdToken(token)
    // const user = { uid: decodedToken.uid }

    // 開発用の簡易認証（トークンから直接UIDを抽出する代替方法）
    const user = { uid: 'test-user-id' } // 開発用ダミーUID

    // クエリパラメータの取得
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    if (!monthParam) {
      return NextResponse.json(
        { success: false, error: '月パラメータが必要です（YYYY-MM形式）' },
        { status: 400 }
      )
    }

    // バリデーション
    const validation = monthQuerySchema.safeParse({ month: monthParam })
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: '月パラメータが無効です（YYYY-MM形式で入力してください）'
        },
        { status: 400 }
      )
    }

    const { year, month } = validation.data.month

    // その月の日付範囲を計算
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Firestoreから空き状況を取得
    const availabilityRef = collection(db, 'users', user.uid, 'availability')
    const q = query(
      availabilityRef,
      where('date', '>=', startDateStr),
      where('date', '<=', endDateStr),
      orderBy('date')
    )

    const querySnapshot = await getDocs(q)
    const availability: DailyAvailability[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      availability.push({
        date: data.date,
        status: data.status as AvailabilityStatus,
        updatedAt: data.updatedAt?.toDate() || new Date()
      })
    })

    return NextResponse.json({
      success: true,
      data: availability
    })

  } catch (error) {
    console.error('スケジュール取得エラー:', error)
    return NextResponse.json(
      { success: false, error: 'スケジュールの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// スケジュール更新（バッチ処理）
export async function PUT(request: NextRequest) {
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
    const user = { uid: 'test-user-id' }

    // リクエストボディの解析
    const body = await request.json()

    // バリデーション
    const validation = batchAvailabilityUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: '入力データが無効です',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }

    const { updates } = validation.data

    // 重複する日付のチェック
    const dates = updates.map(update => update.date)
    const uniqueDates = new Set(dates)
    if (dates.length !== uniqueDates.size) {
      return NextResponse.json(
        { success: false, error: '重複する日付が含まれています' },
        { status: 400 }
      )
    }

    // 日付の妥当性チェック
    for (const update of updates) {
      if (!validateDate(update.date)) {
        return NextResponse.json(
          { success: false, error: `無効な日付です: ${update.date}` },
          { status: 400 }
        )
      }
    }

    // バッチ書き込みの実行
    const batch = writeBatch(db)
    const timestamp = serverTimestamp()

    for (const update of updates) {
      const docRef = doc(db, 'users', user.uid, 'availability', update.date)
      batch.set(docRef, {
        date: update.date,
        status: update.status,
        updatedAt: timestamp
      }, { merge: true })
    }

    await batch.commit()

    return NextResponse.json({
      success: true,
      message: `${updates.length}件のスケジュールを更新しました`,
      updatedCount: updates.length
    })

  } catch (error) {
    console.error('スケジュール更新エラー:', error)
    return NextResponse.json(
      { success: false, error: 'スケジュールの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 単一日付のスケジュール更新
export async function PATCH(request: NextRequest) {
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
    const user = { uid: 'test-user-id' }

    // リクエストボディの解析
    const body = await request.json()
    const { date, status } = body

    // 基本バリデーション
    if (!date || !status) {
      return NextResponse.json(
        { success: false, error: '日付とステータスが必要です' },
        { status: 400 }
      )
    }

    if (!validateDate(date)) {
      return NextResponse.json(
        { success: false, error: '無効な日付形式です（YYYY-MM-DD）' },
        { status: 400 }
      )
    }

    const validStatuses: AvailabilityStatus[] = ['all_day', 'am', 'pm', 'none']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: '無効なステータスです' },
        { status: 400 }
      )
    }

    // Firestoreに保存
    const docRef = doc(db, 'users', user.uid, 'availability', date)
    await setDoc(docRef, {
      date,
      status,
      updatedAt: serverTimestamp()
    }, { merge: true })

    return NextResponse.json({
      success: true,
      message: 'スケジュールを更新しました',
      data: { date, status }
    })

  } catch (error) {
    console.error('スケジュール更新エラー:', error)
    return NextResponse.json(
      { success: false, error: 'スケジュールの更新に失敗しました' },
      { status: 500 }
    )
  }
}