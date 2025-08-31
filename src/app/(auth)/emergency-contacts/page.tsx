import dynamic from 'next/dynamic'
import { Loading } from '@/components/Loading'

// SSRを無効化してクライアントサイドでのみレンダリング
const EmergencyContactsClient = dynamic(() => import('./EmergencyContactsClient'), {
  ssr: false,
  loading: () => <Loading />
})

export default function EmergencyContactsPage() {
  return <EmergencyContactsClient />
}