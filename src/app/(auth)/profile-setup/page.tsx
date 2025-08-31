import dynamic from 'next/dynamic'
import { Loading } from '@/components/Loading'

// SSRを無効化してクライアントサイドでのみレンダリング
const ProfileSetupClient = dynamic(() => import('./ProfileSetupClient'), {
  ssr: false,
  loading: () => <Loading />
})

export default function ProfileSetupPage() {
  return <ProfileSetupClient />
}