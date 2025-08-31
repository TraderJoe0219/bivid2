import dynamic from 'next/dynamic'
import { Loading } from '@/components/Loading'

// SSRを無効化してクライアントサイドでのみレンダリング
const DocumentUploadClient = dynamic(() => import('./DocumentUploadClient'), {
  ssr: false,
  loading: () => <Loading />
})

export default function DocumentUploadPage() {
  return <DocumentUploadClient />
}