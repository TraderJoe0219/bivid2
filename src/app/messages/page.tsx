'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  ArrowLeft,
  User,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/Loading'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  getConversations, 
  startConversation, 
  getMessages, 
  sendMessage,
  type Conversation as APIConversation,
  type Message as APIMessage 
} from '@/lib/messaging'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
  messageType: 'text' | 'image' | 'booking'
  bookingData?: {
    skillTitle: string
    date: string
    status: 'pending' | 'confirmed' | 'cancelled'
  }
}

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
    isOnline: boolean
  }[]
  lastMessage: Message
  unreadCount: number
}

// モックデータ
const sampleConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [
      {
        id: 'user1',
        name: '田中 花子',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'msg1',
      senderId: 'user1',
      receiverId: 'currentUser',
      content: 'お料理教室の件、ありがとうございます。来週の予定はいかがでしょうか？',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分前
      isRead: false,
      messageType: 'text'
    },
    unreadCount: 2
  },
  {
    id: 'conv2',
    participants: [
      {
        id: 'user2',
        name: '鈴木 一郎',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        isOnline: false
      }
    ],
    lastMessage: {
      id: 'msg2',
      senderId: 'currentUser',
      receiverId: 'user2',
      content: 'ガーデニングの道具についてお聞きしたいことがあります。',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
      isRead: true,
      messageType: 'text'
    },
    unreadCount: 0
  }
]

const sampleMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    receiverId: 'currentUser',
    content: 'こんにちは！お料理教室にご興味をお持ちいただき、ありがとうございます。',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg2',
    senderId: 'currentUser',
    receiverId: 'user1',
    content: 'こちらこそ、よろしくお願いします。初心者でも大丈夫でしょうか？',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg3',
    senderId: 'user1',
    receiverId: 'currentUser',
    content: '予約確認',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true,
    messageType: 'booking',
    bookingData: {
      skillTitle: '初心者向けお料理教室',
      date: '2024年1月20日 10:00-12:00',
      status: 'confirmed'
    }
  },
  {
    id: 'msg4',
    senderId: 'user1',
    receiverId: 'currentUser',
    content: 'お料理教室の件、ありがとうございます。来週の予定はいかがでしょうか？',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    messageType: 'text'
  }
]

export default function MessagesPage() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 会話選択時の処理
  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMessages(sampleMessages) // 実際はAPIから取得
    
    // 未読メッセージを既読にする
    const updatedConversations = conversations.map(conv => 
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    )
    setConversations(updatedConversations)
  }

  // メッセージ送信
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      receiverId: selectedConversation.participants[0].id,
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      messageType: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // 会話リストの最新メッセージを更新
    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversation.id
        ? { ...conv, lastMessage: message }
        : conv
    )
    setConversations(updatedConversations)
  }

  // メッセージスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 検索フィルター
  const filteredConversations = conversations.filter(conversation =>
    conversation.participants[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <Button onClick={() => window.location.href = '/login'}>
            ログインする
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
          {/* 会話リスト */}
          <div className={`bg-white border-r border-gray-200 ${selectedConversation ? 'hidden lg:block' : 'block'}`}>
            {/* ヘッダー */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">メッセージ</h1>
              
              {/* 検索 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="会話を検索..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* 会話リスト */}
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {filteredConversations.map(conversation => {
                const participant = conversation.participants[0]
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {participant.avatar ? (
                            <img
                              src={participant.avatar}
                              alt={participant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        {participant.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {participant.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(conversation.lastMessage.timestamp, { 
                              addSuffix: true, 
                              locale: ja 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>メッセージはまだありません</p>
                </div>
              )}
            </div>
          </div>

          {/* メッセージエリア */}
          <div className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* チャットヘッダー */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {selectedConversation.participants[0].avatar ? (
                          <img
                            src={selectedConversation.participants[0].avatar}
                            alt={selectedConversation.participants[0].name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      {selectedConversation.participants[0].isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div>
                      <h2 className="font-medium text-gray-900">
                        {selectedConversation.participants[0].name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.participants[0].isOnline ? 'オンライン' : 'オフライン'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* メッセージリスト */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map(message => {
                    const isOwn = message.senderId === 'currentUser'
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                          {message.messageType === 'booking' && message.bookingData ? (
                            <div className={`rounded-lg p-4 ${
                              isOwn 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-white border border-gray-200'
                            }`}>
                              <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-medium text-sm">予約確認</span>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium">{message.bookingData.skillTitle}</p>
                                <p className="opacity-90">{message.bookingData.date}</p>
                                <div className={`inline-flex items-center px-2 py-1 rounded text-xs mt-2 ${
                                  message.bookingData.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {message.bookingData.status === 'confirmed' ? '確定済み' : '確認待ち'}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={`rounded-lg p-3 ${
                              isOwn 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-white border border-gray-200'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          )}
                          
                          <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 ${
                            isOwn ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>
                              {formatDistanceToNow(message.timestamp, { 
                                addSuffix: true, 
                                locale: ja 
                              })}
                            </span>
                            {isOwn && (
                              <div className="flex items-center space-x-1">
                                {message.isRead ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* メッセージ入力 */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="メッセージを入力..."
                        className="pr-12"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    会話を選択してください
                  </h3>
                  <p className="text-gray-600">
                    左側から会話を選択してメッセージを開始しましょう
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}