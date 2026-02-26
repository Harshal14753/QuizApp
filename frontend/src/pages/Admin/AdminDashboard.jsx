import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAllUsers, getQuestionsByType } from '../../services/AdminService'

// ── Stat card ─────────────────────────────────────────────────────────────────
const STAT_ICONS = {
  users:    'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  category: 'M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8.5v7L12 19.82 4 15.5v-7L12 4.18z',
  bulb:     'M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z',
  grid:     'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
  layers:   'M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z',
  star:     'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z',
  question: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
  target:   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5S9.51 16.5 12 16.5s4.5-2.01 4.5-4.5S14.49 7.5 12 7.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
  shield:   'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  box:      'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.1 15.9 0 13.36 0c-1.3 0-2.48.52-3.36 1.36L9 2.36 7.99 1.36C7.11.52 5.94 0 4.64 0 2.1 0 0 2.1 0 4.64c0 .48.11.92.18 1.36H0v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z',
  work:     'M20 6H16V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
}

const StatCard = ({ iconKey, count, label }) => (
  <div style={{
    background: '#ebebf0', borderRadius: 8, padding: '22px 28px',
    display: 'flex', alignItems: 'center', gap: 20,
  }}>
    <div style={{
      width: 60, height: 60, borderRadius: '50%',
      backgroundColor: '#4338ca', color: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={30} height={30} viewBox="0 0 24 24" fill="currentColor">
        <path d={STAT_ICONS[iconKey]} />
      </svg>
    </div>
    <div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#4338ca', lineHeight: 1.1 }}>{count}</div>
      <div style={{ fontSize: 16, color: '#374151', marginTop: 4 }}>{label}</div>
    </div>
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    users: '...', practice: '...', normal: '...', audio: '...',
    video: '...', trueFalse: '...', daily: '...', fearFactor: '...',
  })

  useEffect(() => {
    const QUIZ_TYPES = [
      'practice-quiz', 'normal-quiz', 'audio-quiz',
      'video-quiz', 'true-false', 'daily-quiz', 'fear-factor',
    ]

    Promise.allSettled([
      getAllUsers(),
      ...QUIZ_TYPES.map(t => getQuestionsByType(t)),
    ]).then(([usersRes, practiceRes, normalRes, audioRes, videoRes, tfRes, dailyRes, ffRes]) => {
      const safe = (res, getter) =>
        res.status === 'fulfilled' ? getter(res.value) : '—'

      setCounts({
        users:      safe(usersRes,    v => v?.users?.length    ?? 0),
        practice:   safe(practiceRes, v => (Array.isArray(v) ? v : v?.questions ?? []).length),
        normal:     safe(normalRes,   v => (Array.isArray(v) ? v : v?.questions ?? []).length),
        audio:      safe(audioRes,    v => (Array.isArray(v) ? v : v?.questions ?? []).length),
        video:      safe(videoRes,    v => (Array.isArray(v) ? v : v?.questions ?? []).length),
        trueFalse:  safe(tfRes,       v => (Array.isArray(v) ? v : v?.questions ?? []).length),
        daily:      safe(dailyRes,    v => (Array.isArray(v) ? v : v?.questions ?? []).length),
        fearFactor: safe(ffRes,       v => (Array.isArray(v) ? v : v?.questions ?? []).length),
      })
    })
  }, [])

  const stats = [
    { iconKey: 'users',    count: counts.users,      label: 'Users' },
    { iconKey: 'category', count: '3',               label: 'Category' },
    { iconKey: 'bulb',     count: '3',               label: 'Skill' },
    { iconKey: 'grid',     count: '3',               label: 'Classification' },
    { iconKey: 'layers',   count: '3',               label: 'Level' },
    { iconKey: 'star',     count: '4',               label: 'Avatar' },
    { iconKey: 'question', count: counts.practice,   label: 'Practice Questions' },
    { iconKey: 'question', count: counts.normal,     label: 'Normal Questions' },
    { iconKey: 'question', count: counts.audio,      label: 'Audio Questions' },
    { iconKey: 'question', count: counts.video,      label: 'Video Questions' },
    { iconKey: 'question', count: counts.trueFalse,  label: 'True / False Questions' },
    { iconKey: 'question', count: counts.daily,      label: 'Daily Quiz Questions' },
    { iconKey: 'question', count: counts.fearFactor, label: 'Fear Factor Questions' },
    { iconKey: 'target',   count: '3',               label: 'Ultimate Challenges' },
    { iconKey: 'shield',   count: '10',              label: 'Contests' },
    { iconKey: 'box',      count: '4',               label: 'Packages' },
    { iconKey: 'work',     count: '3',               label: 'Products' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignContent: 'flex-start' }}>
        {stats.map((s, i) => (
          <StatCard key={i} iconKey={s.iconKey} count={s.count} label={s.label} />
        ))}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard