import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { getQuestionsByType, deleteQuestion } from '../../services/AdminService'

// ── Human-readable labels per quiz type ──────────────────────────────────────
const QUIZ_LABELS = {
  'practice-quiz': 'Practice Quiz',
  'normal-quiz':   'Normal Quiz',
  'audio-quiz':    'Audio Quiz',
  'video-quiz':    'Video Quiz',
  'true-false':    'True / False',
  'daily-quiz':    'Daily Quiz',
  'fear-factor':   'Fear Factor',
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2}>
    <circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/>
  </svg>
)
const SortIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="#9ca3af">
    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
  </svg>
)
const EditIcon = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
)
const ChevronIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z"/>
  </svg>
)

// ── Option label helper ───────────────────────────────────────────────────────
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

const QuizQuestion = () => {
  const { quizType } = useParams()
  const navigate     = useNavigate()
  const label        = QUIZ_LABELS[quizType] ?? quizType

  const [questions, setQuestions]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [search, setSearch]             = useState('')
  const [catFilter, setCatFilter]       = useState('')
  const [skillFilter, setSkillFilter]   = useState('')
  const [classFilter, setClassFilter]   = useState('')
  const [levelFilter, setLevelFilter]   = useState('')

  // ── Fetch questions ───────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    setError(null)
    getQuestionsByType(quizType)
      .then(data => {
        const list = data.questions ?? data
        setQuestions(Array.isArray(list) ? list : [])
      })
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false))
  }, [quizType])

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return
    try {
      await deleteQuestion(quizType, id)
      setQuestions(prev => prev.filter(q => q._id !== id))
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Delete failed')
    }
  }

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = questions.filter(q => {
    const matchSearch = !search || q.question?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = !catFilter   || q.category   === catFilter
    const matchSkill  = !skillFilter || q.skill      === skillFilter
    const matchClass  = !classFilter || q.classification === classFilter
    const matchLevel  = !levelFilter || q.level      === levelFilter
    return matchSearch && matchCat && matchSkill && matchClass && matchLevel
  })

  // ── Dynamic filter options (each depends on upstream selection) ─────────────
  const categoryOptions = [...new Set(questions.map(q => q.category).filter(Boolean))]

  const afterCat    = catFilter   ? questions.filter(q => q.category === catFilter)           : questions
  const skillOptions = [...new Set(afterCat.map(q => q.skill).filter(Boolean))]

  const afterSkill  = skillFilter ? afterCat.filter(q => q.skill === skillFilter)             : afterCat
  const classOptions = [...new Set(afterSkill.map(q => q.classification).filter(Boolean))]

  const afterClass  = classFilter ? afterSkill.filter(q => q.classification === classFilter)  : afterSkill
  const levelOptions = [...new Set(afterClass.map(q => q.level).filter(Boolean))]

  // ── Filter change handlers (reset all downstream filters on change) ────────
  const handleCatChange = (val) => {
    setCatFilter(val)
    setSkillFilter('')
    setClassFilter('')
    setLevelFilter('')
  }
  const handleSkillChange = (val) => {
    setSkillFilter(val)
    setClassFilter('')
    setLevelFilter('')
  }
  const handleClassChange = (val) => {
    setClassFilter(val)
    setLevelFilter('')
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const selectStyle = {
    border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '9px 36px 9px 14px',
    fontSize: 14, color: '#374151', background: '#fff', cursor: 'pointer',
    appearance: 'none', outline: 'none', fontWeight: 500, minWidth: 160,
  }
  const iconBtnStyle = (bg = '#4338ca') => ({
    background: bg, color: '#fff', border: 'none', borderRadius: 7,
    width: 36, height: 36, display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
  })

  return (
    <AdminLayout title={`${label} Questions`}>

      {/* ── Breadcrumb + action buttons ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#eef0f5', borderRadius: 8, padding: '12px 20px', marginBottom: 22,
      }}>
        <div style={{ fontSize: 15, color: '#4338ca', fontWeight: 500 }}>
          <Link to="/admin/dashboard" style={{ color: '#4338ca', textDecoration: 'none' }}>Dashboard</Link>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>{label} Questions</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            background: '#4338ca', color: '#fff', border: 'none', borderRadius: 8,
            padding: '9px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Import Question</button>
          <button
            onClick={() => navigate(`/admin/${quizType}/questions/add`)}
            style={{
              background: '#4338ca', color: '#fff', border: 'none', borderRadius: 8,
              padding: '9px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >Add Question</button>
        </div>
      </div>

      {/* ── Search + Filters card ───────────────────────────────────── */}
      <div style={{
        background: '#f3f4f6', borderRadius: 10, padding: '18px 20px', marginBottom: 22,
      }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', borderRadius: 8, padding: '8px 14px',
          border: '1.5px solid #e5e7eb', marginBottom: 14,
        }}>
          <SearchIcon />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              border: 'none', outline: 'none', fontSize: 15,
              color: '#374151', width: '100%', background: 'transparent',
            }}
          />
        </div>

        {/* Filter dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>Sort by :</span>

          {[
            { label: 'All Category',       value: catFilter,   onChange: handleCatChange,   options: categoryOptions },
            { label: 'All Skill',          value: skillFilter, onChange: handleSkillChange, options: skillOptions },
            { label: 'All Classification', value: classFilter, onChange: handleClassChange, options: classOptions },
            { label: 'All Level',          value: levelFilter, onChange: setLevelFilter,    options: levelOptions },
          ].map(({ label: lbl, value, onChange, options }) => (
            <div key={lbl} style={{ position: 'relative' }}>
              <select
                value={value}
                onChange={e => onChange(e.target.value)}
                style={selectStyle}
              >
                <option value="">{lbl}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <ChevronIcon />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── States ──────────────────────────────────────────────────── */}
      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {error   && <p style={{ color: '#ef4444' }}>{error}</p>}

      {/* ── Table ───────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                {[
                  { label: '#',              width: 48 },
                  { label: 'Image',          width: 90 },
                  { label: 'Basic Info',     width: 180 },
                  { label: 'Question',       width: null, sort: true },
                  { label: 'Option',         width: 220 },
                  { label: 'Status',         width: 100 },
                  { label: 'Action',         width: 130 },
                ].map(h => (
                  <th key={h.label} style={{
                    padding: '13px 14px', textAlign: 'left', fontWeight: 700,
                    color: '#374151', fontSize: 14, width: h.width ?? 'auto',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {h.label}
                      {h.sort && <span style={{ opacity: 0.5 }}><SortIcon /></span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 15 }}>
                    No questions found.
                  </td>
                </tr>
              ) : filtered.map((q, i) => {
                const opts   = q.options ?? []
                const answer = q.answer ?? ''
                const rowBg  = i % 2 === 0 ? '#fff' : '#f9fafb'
                return (
                  <tr key={q._id} style={{ borderBottom: '1px solid #e5e7eb', background: rowBg }}>

                    {/* # */}
                    <td style={{ padding: '14px 14px', color: '#374151', fontWeight: 600, textAlign: 'center' }}>
                      {i + 1}
                    </td>

                    {/* Image */}
                    <td style={{ padding: '14px 10px' }}>
                      {q.image ? (
                        <img
                          src={q.image} alt="question"
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }}
                        />
                      ) : (
                        <div style={{
                          width: 60, height: 60, background: '#e5e7eb', borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexDirection: 'column', border: '1px solid #d1d5db',
                        }}>
                          <span style={{ fontSize: 8, color: '#9ca3af', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
                            NO IMAGE<br/>ADDED
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Basic Info */}
                    <td style={{ padding: '14px 14px', lineHeight: 1.7 }}>
                      <div style={{ fontSize: 13, color: '#374151' }}>
                        <div><b>Category :</b> {q.category ?? '—'}</div>
                        <div><b>Skill :</b> {q.skill ?? '—'}</div>
                        <div><b>Classification :</b> {q.classification ?? '—'}</div>
                        <div><b>Level :</b> {q.level ?? '—'}</div>
                      </div>
                    </td>

                    {/* Question */}
                    <td style={{ padding: '14px 14px', color: '#374151', fontSize: 14, lineHeight: 1.5 }}>
                      {q.question}
                    </td>

                    {/* Options */}
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {opts.map((opt, idx) => {
                          const letter  = OPTION_LETTERS[idx] ?? String(idx + 1)
                          const correct = typeof answer === 'string'
                            ? opt === answer || letter === answer
                            : false
                          return (
                            <div key={idx} style={{ fontSize: 13, color: correct ? '#16a34a' : '#374151', fontWeight: correct ? 700 : 400 }}>
                              <b style={{ color: correct ? '#16a34a' : '#374151' }}>{letter} :</b> {opt}
                            </div>
                          )
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 14px' }}>
                      <button style={{
                        background: q.status === 'hidden' ? '#f3f4f6' : '#16a34a',
                        color: q.status === 'hidden' ? '#6b7280' : '#fff',
                        border: 'none', borderRadius: 6, padding: '6px 18px',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      }}>
                        {q.status === 'hidden' ? 'Hide' : 'Show'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                          onClick={() => navigate(`/admin/${quizType}/questions/${q._id}/edit`)}
                          style={iconBtnStyle('#4338ca')}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          style={iconBtnStyle('#ef4444')}
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

export default QuizQuestion
