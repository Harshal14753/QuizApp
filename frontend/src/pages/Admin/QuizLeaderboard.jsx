import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { http } from '../../config/AxiosHelper'

// ── Human-readable labels per quiz type ──────────────────────────────────────
const QUIZ_LABELS = {
  'practice-quiz': 'Practice Quiz',
  'normal-quiz':   'Normal Quiz',
  'audio-quiz':    'Audio Quiz',
  'video-quiz':    'Video Quiz',
  'true-false':    'True / False',
  'daily-quiz':    'Daily Quiz',
  'fear-factor':   'Fear Factor',
  'contests':      'Contests',
}

const QuizLeaderboard = () => {
  const { quizType } = useParams()           // e.g. "practice-quiz"
  const label = QUIZ_LABELS[quizType] ?? quizType

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ── Fetch leaderboard from backend ───────────────────────────────────────
  // GET /api/admin/leaderboard?type=practice-quiz
  // Backend should return: [{ _id, user: { name, email }, score, completedAt }, ...]
  useEffect(() => {
    setLoading(true)
    setError(null)
    http.get('/api/admin/leaderboard', { params: { type: quizType } })
      .then(res => setEntries(res.data))
      .catch(err => setError(err.response?.data?.message ?? 'Failed to load leaderboard'))
      .finally(() => setLoading(false))
  }, [quizType])

  return (
    <AdminLayout title={`${label} — Leaderboard`}>
      {/* ── Header row ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
          {label} Leaderboard
        </h2>
        <button
          style={{
            background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
            borderRadius: 6, padding: '9px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      {/* ── States ────────────────────────────────────────────────────── */}
      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {error   && <p style={{ color: '#ef4444' }}>{error}</p>}

      {/* ── Table ─────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                {['Rank', 'Name', 'Email', 'Score', 'Completed'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px 16px', textAlign: 'center', color: '#9ca3af' }}>
                    No entries yet.
                  </td>
                </tr>
              ) : entries.map((entry, i) => (
                <tr key={entry._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', width: 60 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: '50%', fontWeight: 700, fontSize: 14,
                      background: i === 0 ? '#fef08a' : i === 1 ? '#e5e7eb' : i === 2 ? '#fed7aa' : '#f3f4f6',
                      color: '#111827',
                    }}>
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 600 }}>
                    {entry.user?.name ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                    {entry.user?.email ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4338ca', fontWeight: 700 }}>
                    {entry.score}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {entry.completedAt ? new Date(entry.completedAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

export default QuizLeaderboard
