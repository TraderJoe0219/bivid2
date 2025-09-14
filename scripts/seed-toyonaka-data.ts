#!/usr/bin/env tsx

/**
 * 豊中市のサンプルデータをFirestoreにシードするスクリプト
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, GeoPoint } from 'firebase-admin/firestore'
import { generateToyonakaSampleSkills, getToyonakaTeachers } from '../src/lib/sampleDataToyonaka'

// Firebase Admin初期化（既に初期化されている場合はスキップ）
try {
  initializeApp({
    // サービスアカウントキーが設定されている場合のみ認証
    ...(process.env.FIREBASE_SERVICE_ACCOUNT_KEY && {
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    }),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  })
} catch (error) {
  // 既に初期化されている場合は無視
  console.log('Firebase Admin already initialized')
}

const db = getFirestore()

async function seedToyonakaData() {
  console.log('🌱 豊中市サンプルデータのシード開始...')

  try {
    // 講師データをシード
    console.log('👨‍🏫 講師データを追加中...')
    const teachers = getToyonakaTeachers()

    for (const teacher of teachers) {
      const docRef = db.collection('users').doc(teacher.id)

      // Firestoreに適した形式に変換（undefinedを除去）
      const firestoreTeacher = Object.fromEntries(
        Object.entries({
          ...teacher,
          coordinates: teacher.coordinates
            ? new GeoPoint(teacher.coordinates.latitude, teacher.coordinates.longitude)
            : null,
          createdAt: Timestamp.fromDate(teacher.createdAt),
          updatedAt: Timestamp.fromDate(teacher.updatedAt)
        }).filter(([_, value]) => value !== undefined)
      )

      await docRef.set(firestoreTeacher, { merge: true })
      console.log(`✅ 講師追加: ${teacher.displayName}`)
    }

    // スキルデータをシード
    console.log('📚 スキルデータを追加中...')
    const skills = generateToyonakaSampleSkills()

    for (const skill of skills) {
      const docRef = db.collection('skills').doc(skill.id)

      // Firestoreに適した形式に変換（undefinedを除去）
      const cleanTeacher = Object.fromEntries(
        Object.entries({
          ...skill.teacher,
          coordinates: skill.teacher.coordinates
            ? new GeoPoint(skill.teacher.coordinates.latitude, skill.teacher.coordinates.longitude)
            : null,
          createdAt: Timestamp.fromDate(skill.teacher.createdAt),
          updatedAt: Timestamp.fromDate(skill.teacher.updatedAt)
        }).filter(([_, value]) => value !== undefined)
      )

      const firestoreSkill = Object.fromEntries(
        Object.entries({
          ...skill,
          coordinates: skill.coordinates
            ? new GeoPoint(skill.coordinates.latitude, skill.coordinates.longitude)
            : null,
          teacher: cleanTeacher,
          createdAt: Timestamp.fromDate(skill.createdAt),
          updatedAt: Timestamp.fromDate(skill.updatedAt)
        }).filter(([_, value]) => value !== undefined)
      )

      await docRef.set(firestoreSkill, { merge: true })
      console.log(`✅ スキル追加: ${skill.title}`)
    }

    // 統計情報を更新
    console.log('📊 統計情報を更新中...')
    const statsRef = db.collection('stats').doc('toyonaka')
    await statsRef.set({
      totalTeachers: teachers.length,
      totalSkills: skills.length,
      categories: [...new Set(skills.map(skill => skill.category))],
      avgPrice: skills.reduce((sum, skill) => sum + skill.price, 0) / skills.length,
      avgRating: skills.reduce((sum, skill) => sum + skill.rating, 0) / skills.length,
      lastUpdated: Timestamp.now(),
      area: {
        name: '豊中市',
        center: new GeoPoint(34.7813, 135.4696),
        bounds: {
          north: 34.82,
          south: 34.74,
          east: 135.52,
          west: 135.42
        }
      }
    }, { merge: true })

    console.log('🎉 豊中市サンプルデータのシード完了！')
    console.log(`📝 講師: ${teachers.length}人`)
    console.log(`📚 スキル: ${skills.length}件`)

    // 成功時の詳細情報
    console.log('\n📍 登録されたエリア:')
    const areas = [...new Set(teachers.map(t => t.location))]
    areas.forEach(area => console.log(`  - ${area}`))

    console.log('\n📂 登録されたカテゴリ:')
    const categories = [...new Set(skills.map(s => s.category))]
    categories.forEach(category => console.log(`  - ${category}`))

  } catch (error) {
    console.error('❌ データシードエラー:', error)
    process.exit(1)
  }
}

async function clearToyonakaData() {
  console.log('🧹 既存の豊中市データをクリア中...')

  try {
    // 豊中市の講師データを削除
    const teachersSnapshot = await db.collection('users')
      .where('id', '>=', 'toyonaka-teacher-1')
      .where('id', '<=', 'toyonaka-teacher-99')
      .get()

    const teacherBatch = db.batch()
    teachersSnapshot.docs.forEach(doc => {
      teacherBatch.delete(doc.ref)
    })

    if (!teachersSnapshot.empty) {
      await teacherBatch.commit()
      console.log(`🗑️ 講師データ ${teachersSnapshot.size} 件を削除`)
    }

    // 豊中市のスキルデータを削除
    const skillsSnapshot = await db.collection('skills')
      .where('id', '>=', 'toyonaka-skill-1')
      .where('id', '<=', 'toyonaka-skill-99')
      .get()

    const skillsBatch = db.batch()
    skillsSnapshot.docs.forEach(doc => {
      skillsBatch.delete(doc.ref)
    })

    if (!skillsSnapshot.empty) {
      await skillsBatch.commit()
      console.log(`🗑️ スキルデータ ${skillsSnapshot.size} 件を削除`)
    }

    console.log('✅ クリア完了')

  } catch (error) {
    console.error('❌ データクリアエラー:', error)
    process.exit(1)
  }
}

// コマンドライン引数の処理
const command = process.argv[2]

async function main() {
  switch (command) {
    case 'clear':
      await clearToyonakaData()
      break
    case 'seed':
      await seedToyonakaData()
      break
    case 'reset':
      await clearToyonakaData()
      await seedToyonakaData()
      break
    default:
      console.log(`
使用方法:
  npm run seed:toyonaka seed   - 豊中市データを追加
  npm run seed:toyonaka clear  - 豊中市データを削除
  npm run seed:toyonaka reset  - 豊中市データをリセット（削除→追加）
      `)
      process.exit(1)
  }

  process.exit(0)
}

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error('❌ 未処理のエラー:', error)
  process.exit(1)
})

// 実行
main().catch(console.error)