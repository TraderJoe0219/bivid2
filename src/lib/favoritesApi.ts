import { auth } from './firebase'
import { Skill } from '@/types/skill'

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  
  try {
    return await user.getIdToken()
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}

export async function getUserFavorites(): Promise<string[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch('/api/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch favorites')
    }

    const data = await response.json()
    return data.favoriteSkillIds || []
  } catch (error) {
    console.error('Failed to get user favorites:', error)
    throw error
  }
}

export async function getFavoriteSkills(skillIds: string[]): Promise<Skill[]> {
  if (skillIds.length === 0) return []

  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch('/api/favorites/skills', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skillIds }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch favorite skills')
    }

    const data = await response.json()
    return data.skills || []
  } catch (error) {
    console.error('Failed to get favorite skills:', error)
    throw error
  }
}

export async function addFavoriteSkill(skillId: string): Promise<void> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skillId }),
    })

    if (!response.ok) {
      throw new Error('Failed to add favorite')
    }
  } catch (error) {
    console.error('Failed to add favorite skill:', error)
    throw error
  }
}

export async function removeFavoriteSkill(skillId: string): Promise<void> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch(`/api/favorites?skillId=${encodeURIComponent(skillId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to remove favorite')
    }
  } catch (error) {
    console.error('Failed to remove favorite skill:', error)
    throw error
  }
}