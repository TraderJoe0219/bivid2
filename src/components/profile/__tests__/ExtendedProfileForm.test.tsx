// ExtendedProfileForm のテスト
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ExtendedProfileForm } from '../ExtendedProfileForm'
import { ExtendedUserProfile } from '@/types/profile'

// React Hook Form のモック
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn().mockReturnValue({}),
    handleSubmit: jest.fn((fn) => (e) => {
      e.preventDefault()
      fn({
        displayName: 'テストユーザー',
        bio: 'テストの自己紹介',
        prefecture: '大阪府',
        city: '豊中市',
        address: '中桜塚',
        interests: ['スマホサポート']
      })
    }),
    formState: { errors: {} },
    setValue: jest.fn(),
    watch: jest.fn((field) => {
      const values = {
        displayName: 'テストユーザー',
        bio: 'テストの自己紹介',
        prefecture: '大阪府'
      }
      return values[field as keyof typeof values] || ''
    }),
    reset: jest.fn()
  })
}))

const mockProfile: ExtendedUserProfile = {
  uid: 'test-uid',
  displayName: 'テストユーザー',
  bio: 'テストの自己紹介です',
  home: {
    prefecture: '大阪府',
    city: '豊中市',
    address: '中桜塚',
    lat: 34.7804,
    lng: 135.4686
  },
  interests: ['スマホサポート', '健康'],
  createdAt: {} as any,
  updatedAt: {} as any
}

const mockOnSave = jest.fn().mockResolvedValue(undefined)

describe('ExtendedProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    expect(screen.getByText('マイプロフィール')).toBeInTheDocument()
    expect(screen.getByText('基本情報や興味のあることを設定して')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /保存/ })).toBeInTheDocument()
  })

  it('プロフィールが未設定でも表示される', () => {
    render(
      <ExtendedProfileForm
        profile={null}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    expect(screen.getByText('マイプロフィール')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /保存/ })).toBeInTheDocument()
  })

  it('基本情報セクションが表示される', () => {
    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    expect(screen.getByText('基本情報')).toBeInTheDocument()
    expect(screen.getByLabelText('ニックネーム')).toBeInTheDocument()
    expect(screen.getByLabelText('自己紹介')).toBeInTheDocument()
    expect(screen.getByText('都道府県')).toBeInTheDocument()
    expect(screen.getByLabelText('市区町村')).toBeInTheDocument()
  })

  it('興味・関心セクションが表示される', () => {
    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    expect(screen.getByText('興味・関心')).toBeInTheDocument()
    expect(screen.getByText('興味のあることや参加したい活動を選択してください')).toBeInTheDocument()

    // 興味タグのボタンが表示される
    expect(screen.getByRole('button', { name: 'スマホサポート' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '買い物同行' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '庭仕事' })).toBeInTheDocument()
  })

  it('興味タグの選択・解除ができる', async () => {
    const user = userEvent.setup()

    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    const buyingButton = screen.getByRole('button', { name: '買い物同行' })

    // 初期状態では選択されていない
    expect(buyingButton).not.toHaveClass('bg-elder-interactive-primary')

    // クリックして選択
    await user.click(buyingButton)

    // 選択済みのタグが表示される
    await waitFor(() => {
      expect(screen.getByText('選択した興味・関心')).toBeInTheDocument()
    })
  })

  it('フォーム送信が正しく動作する', async () => {
    const user = userEvent.setup()

    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    const saveButton = screen.getByRole('button', { name: /保存/ })
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        displayName: 'テストユーザー',
        bio: 'テストの自己紹介',
        prefecture: '大阪府',
        city: '豊中市',
        address: '中桜塚',
        interests: expect.any(Array)
      })
    })
  })

  it('ローディング状態で保存ボタンが無効になる', () => {
    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={true}
      />
    )

    const saveButton = screen.getByRole('button', { name: /保存/ })
    expect(saveButton).toBeDisabled()
  })

  it('成功メッセージが表示される', async () => {
    const user = userEvent.setup()

    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    const saveButton = screen.getByRole('button', { name: /保存/ })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('プロフィールを保存しました')).toBeInTheDocument()
    })
  })

  it('興味タグの上限（10個）が制御される', () => {
    const profileWithManyInterests = {
      ...mockProfile,
      interests: [
        'スマホサポート', '買い物同行', '庭仕事', 'おしゃべり', '料理・お菓子作り',
        '散歩・ウォーキング', '健康・体操', '手芸・裁縫', '読書・勉強', '音楽・楽器'
      ]
    }

    render(
      <ExtendedProfileForm
        profile={profileWithManyInterests}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    // 10個選択済みの場合、未選択のボタンが無効になる
    const movieButton = screen.getByRole('button', { name: '映画・テレビ' })
    expect(movieButton).toBeDisabled()

    // 選択数の表示
    expect(screen.getByText('選択中: 10/10個')).toBeInTheDocument()
  })

  it('文字数制限が表示される', () => {
    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    // 自己紹介の文字数表示
    const bioLength = mockProfile.bio?.length || 0
    expect(screen.getByText(`${bioLength}/500文字`)).toBeInTheDocument()
  })

  it('都道府県の選択肢が表示される', () => {
    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={mockOnSave}
        isLoading={false}
      />
    )

    const prefectureSelect = screen.getByDisplayValue('大阪府') as HTMLSelectElement
    expect(prefectureSelect).toBeInTheDocument()

    // オプションが存在することを確認
    const options = Array.from(prefectureSelect.options).map(option => option.value)
    expect(options).toContain('北海道')
    expect(options).toContain('東京都')
    expect(options).toContain('大阪府')
    expect(options).toContain('沖縄県')
  })

  it('保存エラー時の処理', async () => {
    const errorOnSave = jest.fn().mockRejectedValue(new Error('保存エラー'))
    const user = userEvent.setup()

    render(
      <ExtendedProfileForm
        profile={mockProfile}
        onSave={errorOnSave}
        isLoading={false}
      />
    )

    const saveButton = screen.getByRole('button', { name: /保存/ })
    await user.click(saveButton)

    await waitFor(() => {
      expect(errorOnSave).toHaveBeenCalled()
    })

    // エラーハンドリングは親コンポーネントで行うため、
    // ここではonSaveが呼ばれることのみ確認
  })
})