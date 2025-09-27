// レコメンドエンジンのヘルパー関数
import { ExtendedUserProfile } from '@/types/profile'
import { AvailabilityStatus } from '@/types/schedule'
import { Activity, RecommendationResult, RecommendationReason } from '@/types/recommendations'

// Haversine距離計算（km）
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // 地球の半径（km）
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// 時間帯の重複チェック
export function checkTimeOverlap(
  activityStart: string,
  activityEnd: string,
  availabilityStatus: AvailabilityStatus
): { isOverlapping: boolean; overlapRatio: number } {
  const actStart = new Date(activityStart)
  const actEnd = new Date(activityEnd)

  // 日本時間の時間帯を定義
  const today = actStart.toDateString()
  let availStart: Date
  let availEnd: Date

  switch (availabilityStatus) {
    case 'am':
      availStart = new Date(`${today} 09:00:00`)
      availEnd = new Date(`${today} 12:00:00`)
      break
    case 'pm':
      availStart = new Date(`${today} 13:00:00`)
      availEnd = new Date(`${today} 17:00:00`)
      break
    case 'all_day':
      availStart = new Date(`${today} 09:00:00`)
      availEnd = new Date(`${today} 17:00:00`)
      break
    case 'none':
      return { isOverlapping: false, overlapRatio: 0 }
    default:
      return { isOverlapping: false, overlapRatio: 0 }
  }

  // 重複時間の計算
  const overlapStart = new Date(Math.max(actStart.getTime(), availStart.getTime()))
  const overlapEnd = new Date(Math.min(actEnd.getTime(), availEnd.getTime()))

  if (overlapStart >= overlapEnd) {
    return { isOverlapping: false, overlapRatio: 0 }
  }

  const overlapDuration = overlapEnd.getTime() - overlapStart.getTime()
  const activityDuration = actEnd.getTime() - actStart.getTime()
  const overlapRatio = overlapDuration / activityDuration

  return {
    isOverlapping: true,
    overlapRatio: Math.min(overlapRatio, 1)
  }
}

// 興味タグの一致度計算
export function calculateTagMatch(
  userInterests: string[],
  activityTags: string[]
): { matchCount: number; matchedTags: string[] } {
  const matchedTags = userInterests.filter(interest =>
    activityTags.some(tag =>
      tag.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(tag.toLowerCase())
    )
  )

  return {
    matchCount: matchedTags.length,
    matchedTags
  }
}

// レコメンドスコア計算
export function calculateRecommendationScore(
  user: ExtendedUserProfile,
  activity: Activity,
  availabilityStatus: AvailabilityStatus,
  distance: number
): { score: number; reasons: RecommendationReason[] } {
  const reasons: RecommendationReason[] = []
  let totalScore = 0

  // 1. タグマッチスコア（重み: 3）
  const tagMatch = calculateTagMatch(user.interests, activity.tags)
  const tagScore = tagMatch.matchCount * 3
  totalScore += tagScore

  if (tagMatch.matchCount > 0) {
    reasons.push({
      type: 'tag_match',
      value: tagScore,
      description: `興味のあるタグが${tagMatch.matchCount}個一致しています`
    })
  }

  // 2. 時間帯マッチスコア（重み: 2）
  const timeOverlap = checkTimeOverlap(activity.start, activity.end, availabilityStatus)
  const timeScore = timeOverlap.isOverlapping ? timeOverlap.overlapRatio * 2 : 0
  totalScore += timeScore

  if (timeOverlap.isOverlapping) {
    reasons.push({
      type: 'time_match',
      value: timeScore,
      description: `あなたの空き時間と${Math.round(timeOverlap.overlapRatio * 100)}%重複しています`
    })
  }

  // 3. 距離スコア（重み: 1、近いほど高い）
  const maxDistance = 10 // 最大10km
  const distanceScore = Math.max(0, (maxDistance - distance) / maxDistance)
  totalScore += distanceScore

  if (distance <= maxDistance) {
    reasons.push({
      type: 'distance',
      value: distanceScore,
      description: `お住まいから約${distance.toFixed(1)}km の距離です`
    })
  }

  // 4. 評価スコア（重み: 0.5）
  if (activity.rating) {
    const ratingScore = (activity.rating / 5) * 0.5
    totalScore += ratingScore

    reasons.push({
      type: 'rating',
      value: ratingScore,
      description: `評価${activity.rating.toFixed(1)}の活動です`
    })
  }

  return { score: totalScore, reasons }
}

// 活動をフィルタリング
export function filterActivitiesByAvailability(
  activities: Activity[],
  dateStr: string,
  availabilityStatus: AvailabilityStatus
): Activity[] {
  if (availabilityStatus === 'none') {
    return []
  }

  return activities.filter(activity => {
    const activityDate = new Date(activity.start).toISOString().split('T')[0]

    // 指定された日付の活動のみ
    if (activityDate !== dateStr) {
      return false
    }

    // 時間帯の重複チェック
    const timeOverlap = checkTimeOverlap(activity.start, activity.end, availabilityStatus)
    return timeOverlap.isOverlapping
  })
}

// 地理的範囲でフィルタリング
export function filterActivitiesByDistance(
  activities: Activity[],
  userLat: number,
  userLng: number,
  maxDistance: number = 10
): Array<Activity & { distance: number }> {
  return activities
    .map(activity => ({
      ...activity,
      distance: calculateDistance(
        userLat,
        userLng,
        activity.location.lat,
        activity.location.lng
      )
    }))
    .filter(activity => activity.distance <= maxDistance)
}

// レコメンド結果の生成
export function generateRecommendations(
  user: ExtendedUserProfile,
  activities: Activity[],
  dateStr: string,
  availabilityStatus: AvailabilityStatus
): RecommendationResult[] {
  // ユーザーの位置情報がない場合は空の結果を返す
  if (!user.home?.lat || !user.home?.lng) {
    return []
  }

  // 空き状況でフィルタリング
  const availableActivities = filterActivitiesByAvailability(
    activities,
    dateStr,
    availabilityStatus
  )

  // 距離でフィルタリング
  const nearbyActivities = filterActivitiesByDistance(
    availableActivities,
    user.home.lat,
    user.home.lng
  )

  // スコア計算とレコメンド結果生成
  const recommendations: RecommendationResult[] = nearbyActivities.map(activity => {
    const { score, reasons } = calculateRecommendationScore(
      user,
      activity,
      availabilityStatus,
      activity.distance
    )

    const timeOverlap = checkTimeOverlap(activity.start, activity.end, availabilityStatus)
    const tagMatch = calculateTagMatch(user.interests, activity.tags)

    return {
      activity,
      score,
      reasons,
      distance: activity.distance,
      timeMatch: timeOverlap.isOverlapping,
      tagMatches: tagMatch.matchedTags
    }
  })

  // スコア順でソート
  return recommendations.sort((a, b) => b.score - a.score)
}