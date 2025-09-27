// レコメンドヘルパー関数のテスト
import {
  calculateDistance,
  checkTimeOverlap,
  calculateTagMatch,
  calculateRecommendationScore,
  filterActivitiesByAvailability,
  filterActivitiesByDistance,
  generateRecommendations
} from '../recommendations'
import { ExtendedUserProfile } from '@/types/profile'
import { Activity } from '@/types/recommendations'
import { AvailabilityStatus } from '@/types/schedule'

describe('recommendations helpers', () => {
  describe('calculateDistance', () => {
    it('正確な距離を計算する', () => {
      // 豊中市役所から梅田駅までの距離（約15km）
      const distance = calculateDistance(34.7804, 135.4686, 34.7024, 135.4959)
      expect(distance).toBeCloseTo(15, 0) // 誤差1km以内
    })

    it('同じ座標では距離0を返す', () => {
      const distance = calculateDistance(34.7804, 135.4686, 34.7804, 135.4686)
      expect(distance).toBe(0)
    })
  })

  describe('checkTimeOverlap', () => {
    it('終日の場合に正しく重複を判定する', () => {
      const result = checkTimeOverlap(
        '2025-10-05T10:00:00+09:00',
        '2025-10-05T12:00:00+09:00',
        'all_day'
      )
      expect(result.isOverlapping).toBe(true)
      expect(result.overlapRatio).toBe(1) // 完全に含まれる
    })

    it('午前の場合に正しく重複を判定する', () => {
      const result = checkTimeOverlap(
        '2025-10-05T10:00:00+09:00',
        '2025-10-05T11:00:00+09:00',
        'am'
      )
      expect(result.isOverlapping).toBe(true)
      expect(result.overlapRatio).toBe(1)
    })

    it('午後の場合に重複しない', () => {
      const result = checkTimeOverlap(
        '2025-10-05T10:00:00+09:00',
        '2025-10-05T11:00:00+09:00',
        'pm'
      )
      expect(result.isOverlapping).toBe(false)
      expect(result.overlapRatio).toBe(0)
    })

    it('利用不可の場合は重複しない', () => {
      const result = checkTimeOverlap(
        '2025-10-05T10:00:00+09:00',
        '2025-10-05T11:00:00+09:00',
        'none'
      )
      expect(result.isOverlapping).toBe(false)
      expect(result.overlapRatio).toBe(0)
    })
  })

  describe('calculateTagMatch', () => {
    it('一致するタグを正しく計算する', () => {
      const userInterests = ['買い物同行', 'スマホサポート', '健康']
      const activityTags = ['スマホサポート', '学習', 'IT']

      const result = calculateTagMatch(userInterests, activityTags)
      expect(result.matchCount).toBe(1)
      expect(result.matchedTags).toEqual(['スマホサポート'])
    })

    it('部分一致も検出する', () => {
      const userInterests = ['スマホ']
      const activityTags = ['スマホサポート']

      const result = calculateTagMatch(userInterests, activityTags)
      expect(result.matchCount).toBe(1)
      expect(result.matchedTags).toEqual(['スマホ'])
    })

    it('一致しない場合は0を返す', () => {
      const userInterests = ['料理']
      const activityTags = ['スマホサポート', 'IT']

      const result = calculateTagMatch(userInterests, activityTags)
      expect(result.matchCount).toBe(0)
      expect(result.matchedTags).toEqual([])
    })
  })

  describe('calculateRecommendationScore', () => {
    const mockUser: ExtendedUserProfile = {
      uid: 'user1',
      displayName: 'テストユーザー',
      bio: 'テストユーザーです',
      home: { lat: 34.7804, lng: 135.4686, prefecture: '大阪府', city: '豊中市' },
      interests: ['スマホサポート', '健康'],
      createdAt: {} as any,
      updatedAt: {} as any
    }

    const mockActivity: Activity = {
      id: 'activity1',
      title: 'スマホ教室',
      category: '学び',
      tags: ['スマホサポート', 'IT'],
      start: '2025-10-05T10:00:00+09:00',
      end: '2025-10-05T12:00:00+09:00',
      location: {
        lat: 34.7800,
        lng: 135.4690,
        address: '豊中市中央公民館'
      },
      createdAt: {} as any,
      updatedAt: {} as any
    }

    it('正しくスコアを計算する', () => {
      const result = calculateRecommendationScore(
        mockUser,
        mockActivity,
        'all_day',
        0.5 // 0.5km
      )

      expect(result.score).toBeGreaterThan(0)
      expect(result.reasons).toHaveLength(3) // タグ、時間、距離の理由
    })

    it('評価がある場合は評価スコアも含む', () => {
      const activityWithRating = { ...mockActivity, rating: 4.5 }
      const result = calculateRecommendationScore(
        mockUser,
        activityWithRating,
        'all_day',
        0.5
      )

      expect(result.reasons.some(r => r.type === 'rating')).toBe(true)
    })
  })

  describe('filterActivitiesByAvailability', () => {
    const mockActivities: Activity[] = [
      {
        id: 'activity1',
        title: '午前の活動',
        category: '学び',
        tags: [],
        start: '2025-10-05T10:00:00+09:00',
        end: '2025-10-05T11:00:00+09:00',
        location: { lat: 34.7804, lng: 135.4686, address: '豊中市' },
        createdAt: {} as any,
        updatedAt: {} as any
      },
      {
        id: 'activity2',
        title: '午後の活動',
        category: '学び',
        tags: [],
        start: '2025-10-05T14:00:00+09:00',
        end: '2025-10-05T15:00:00+09:00',
        location: { lat: 34.7804, lng: 135.4686, address: '豊中市' },
        createdAt: {} as any,
        updatedAt: {} as any
      },
      {
        id: 'activity3',
        title: '別の日の活動',
        category: '学び',
        tags: [],
        start: '2025-10-06T10:00:00+09:00',
        end: '2025-10-06T11:00:00+09:00',
        location: { lat: 34.7804, lng: 135.4686, address: '豊中市' },
        createdAt: {} as any,
        updatedAt: {} as any
      }
    ]

    it('午前の空き状況で午前の活動をフィルタリング', () => {
      const result = filterActivitiesByAvailability(
        mockActivities,
        '2025-10-05',
        'am'
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('activity1')
    })

    it('終日の空き状況で午前と午後の活動をフィルタリング', () => {
      const result = filterActivitiesByAvailability(
        mockActivities,
        '2025-10-05',
        'all_day'
      )

      expect(result).toHaveLength(2)
      expect(result.map(a => a.id)).toEqual(['activity1', 'activity2'])
    })

    it('利用不可の場合は空の配列を返す', () => {
      const result = filterActivitiesByAvailability(
        mockActivities,
        '2025-10-05',
        'none'
      )

      expect(result).toHaveLength(0)
    })
  })

  describe('filterActivitiesByDistance', () => {
    const mockActivities: Activity[] = [
      {
        id: 'activity1',
        title: '近い活動',
        category: '学び',
        tags: [],
        start: '2025-10-05T10:00:00+09:00',
        end: '2025-10-05T11:00:00+09:00',
        location: { lat: 34.7800, lng: 135.4690, address: '近い場所' }, // 約50m
        createdAt: {} as any,
        updatedAt: {} as any
      },
      {
        id: 'activity2',
        title: '遠い活動',
        category: '学び',
        tags: [],
        start: '2025-10-05T10:00:00+09:00',
        end: '2025-10-05T11:00:00+09:00',
        location: { lat: 34.7024, lng: 135.4959, address: '遠い場所' }, // 約15km
        createdAt: {} as any,
        updatedAt: {} as any
      }
    ]

    it('指定した距離内の活動をフィルタリング', () => {
      const result = filterActivitiesByDistance(
        mockActivities,
        34.7804,
        135.4686,
        5 // 5km以内
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('activity1')
      expect(result[0].distance).toBeLessThan(1)
    })

    it('距離プロパティが正しく設定される', () => {
      const result = filterActivitiesByDistance(
        mockActivities,
        34.7804,
        135.4686,
        20
      )

      expect(result).toHaveLength(2)
      result.forEach(activity => {
        expect(activity.distance).toBeDefined()
        expect(typeof activity.distance).toBe('number')
      })
    })
  })
})