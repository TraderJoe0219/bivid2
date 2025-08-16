import { auth } from './firebase'

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

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'file'
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participantIds: string[]
  participantNames: string[]
  skillId?: string
  lastMessage: string
  lastMessageAt: string
  isActive: boolean
  createdAt: string
}

export async function getConversations(): Promise<Conversation[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch('/api/conversations', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch conversations')
    }

    const data = await response.json()
    return data.conversations || []
  } catch (error) {
    console.error('Failed to get conversations:', error)
    throw error
  }
}

export async function startConversation(
  participantId: string,
  skillId?: string,
  initialMessage?: string
): Promise<Conversation> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participantId,
        skillId,
        initialMessage,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to start conversation')
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to start conversation:', error)
    throw error
  }
}

export async function getMessages(conversationId: string, limit = 50): Promise<Message[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch(
      `/api/messages?conversationId=${encodeURIComponent(conversationId)}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }

    const data = await response.json()
    return data.messages || []
  } catch (error) {
    console.error('Failed to get messages:', error)
    throw error
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text'
): Promise<Message> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        content,
        type,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to send message:', error)
    throw error
  }
}