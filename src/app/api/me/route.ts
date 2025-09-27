// マイプロフィールAPI
import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getServerAuth } from '@/lib/server-auth'
import { profileUpdateSchema } from '@/lib/validations/profile'
import { ExtendedUserProfile } from '@/types/profile'

// プロフィール取得
export async function GET(request: NextRequest) {
  try {
    // 認証確認
    const { user, error } = await getServerAuth()
    if (error || !user) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }

    // Firestoreからプロフィール取得
    const profileRef = doc(db, 'users', user.uid)
    const profileSnap = await getDoc(profileRef)

    if (!profileSnap.exists()) {
      // プロフィールが存在しない場合は基本データを返す
      const basicProfile: Partial<ExtendedUserProfile> = {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || '',
        bio: '',
        home: null,
        interests: []
      }

      return NextResponse.json({
        success: true,
        data: basicProfile
      })
    }

    const profileData = profileSnap.data()
    const profile: ExtendedUserProfile = {
      uid: user.uid,
      displayName: profileData.displayName || user.displayName || '',
      bio: profileData.bio || '',
      home: profileData.home || null,
      interests: profileData.interests || [],
      createdAt: profileData.createdAt || serverTimestamp(),
      updatedAt: profileData.updatedAt || serverTimestamp()
    }

    return NextResponse.json({
      success: true,
      data: profile
    })

  } catch (error) {
    console.error('プロフィール取得エラー:', error)
    return NextResponse.json(
      { success: false, error: 'プロフィールの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// プロフィール更新
export async function PATCH(request: NextRequest) {
  try {
    // 認証確認
    const { user, error } = await getServerAuth()
    if (error || !user) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }

    // リクエストボディの解析
    const body = await request.json()

    // バリデーション
    const validation = profileUpdateSchema.safeParse(body)
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

    const { displayName, bio, prefecture, city, address, interests } = validation.data

    // 住所からジオコーディング（Google Maps APIを使用）
    let location = null
    if (prefecture && city) {
      try {
        const fullAddress = `${prefecture}${city}${address || ''}`
        location = await geocodeAddress(fullAddress)
      } catch (geocodeError) {
        console.warn('ジオコーディングエラー:', geocodeError)
        // ジオコーディングに失敗しても処理を続行
      }
    }

    // プロフィールデータの構築
    const profileData = {
      displayName,
      bio: bio || '',
      home: location ? {
        prefecture,
        city,
        address: address || '',
        lat: location.lat,
        lng: location.lng
      } : null,
      interests,
      updatedAt: serverTimestamp()
    }

    // 既存プロフィールの確認
    const profileRef = doc(db, 'users', user.uid)
    const existingProfile = await getDoc(profileRef)

    if (!existingProfile.exists()) {
      // 新規作成
      await setDoc(profileRef, {
        ...profileData,
        uid: user.uid,
        createdAt: serverTimestamp()
      })
    } else {
      // 更新
      await setDoc(profileRef, profileData, { merge: true })
    }

    // 更新されたプロフィールを取得して返す
    const updatedProfile = await getDoc(profileRef)
    const responseData = updatedProfile.data()

    return NextResponse.json({
      success: true,
      data: {
        uid: user.uid,
        displayName: responseData?.displayName,
        bio: responseData?.bio,
        home: responseData?.home,
        interests: responseData?.interests,
        updatedAt: new Date()
      },
      message: 'プロフィールを更新しました'
    })

  } catch (error) {
    console.error('プロフィール更新エラー:', error)
    return NextResponse.json(
      { success: false, error: 'プロフィールの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// Google Maps APIを使用したジオコーディング
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Maps API キーが設定されていません')
  }

  const encodedAddress = encodeURIComponent(address)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&region=jp&language=ja&key=${apiKey}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('ジオコーディングAPIの呼び出しに失敗しました')
  }

  const data = await response.json()
  if (data.status !== 'OK' || !data.results.length) {
    throw new Error('住所の位置情報を取得できませんでした')
  }

  const location = data.results[0].geometry.location
  return {
    lat: location.lat,
    lng: location.lng
  }
}