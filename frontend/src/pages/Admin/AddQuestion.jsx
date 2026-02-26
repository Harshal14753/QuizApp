import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import {
  createQuestion,
  updateQuestion,
  getQuestionById,
} from '../../services/AdminService'

const QUIZ_LABELS = {
  'practice-quiz': 'Practice Quiz',
  'normal-quiz':   'Normal Quiz',
  'audio-quiz':    'Audio Quiz',
  'video-quiz':    'Video Quiz',
  'true-false':    'True / False',
  'daily-quiz':    'Daily Quiz',
  'fear-factor':   'Fear Factor',
}

const CATEGORIES     = ['General Knowledge', 'History', 'Sports']
const SKILLS         = ['Beginner', 'Advance', 'Expert']
const CLASSIFICATIONS = ['Easy', 'Medium', 'Hard']
const LEVELS         = ['Level 1', 'Level 2', 'Level 3']

const EMPTY_FORM = {
  category:       '',
  skill:          '',
  classification: '',
  level:          '',
  image:          '',
  question:       '',
  options:        ['', '', '', ''],
  answer:         '',
  coins:          10,
  status:         'show',
}

// ── Styles ───────────────────────────────────────────────────────────────────
const inputStyle = {
  border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 14px',
  fontSize: 14, color: '#374151', width: '100%', outline: 'none',
  boxSizing: 'border-box', background: '#fff',
}
const labelStyle = { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 5, display: 'block' }
const fieldWrap  = { display: 'flex', flexDirection: 'column', marginBottom: 18 }

const AddQuestion = () => {
  const { quizType, id } = useParams()
  const navigate         = useNavigate()
  const isEdit           = !!id
  const quizLabel        = QUIZ_LABELS[quizType] ?? quizType

  const [form, setForm]       = useState(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)
  const [loadErr, setLoadErr] = useState(null)
  const [saveErr, setSaveErr] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  // ── Load question data for edit ───────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    getQuestionById(quizType, id)
      .then(data => {
        const q = data.question ?? data
        setForm({
          category:       q.category       ?? '',
          skill:          q.skill          ?? '',
          classification: q.classification ?? '',
          level:          q.level          ?? '',
          image:          q.image          ?? '',
          question:       q.question       ?? '',
          options:        q.options?.length ? [...q.options, ...Array(Math.max(0, 4 - q.options.length)).fill('')] : ['', '', '', ''],
          answer:         q.answer         ?? '',
          coins:          q.coins          ?? 10,
          status:         q.status         ?? 'show',
        })
      })
      .catch(() => setLoadErr('Failed to load question.'))
      .finally(() => setLoading(false))
  }, [quizType, id, isEdit])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const setOption = (idx, value) => {
    setForm(prev => {
      const opts = [...prev.options]
      opts[idx] = value
      // If the current answer matched the old value, clear it
      const newAnswer = prev.answer === prev.options[idx] ? '' : prev.answer
      return { ...prev, options: opts, answer: newAnswer }
    })
  }

  const addOption = () => {
    if (form.options.length >= 5) return
    setForm(prev => ({ ...prev, options: [...prev.options, ''] }))
  }

  const removeOption = (idx) => {
    if (form.options.length <= 2) return
    setForm(prev => {
      const opts = prev.options.filter((_, i) => i !== idx)
      const newAnswer = prev.answer === prev.options[idx] ? '' : prev.answer
      return { ...prev, options: opts, answer: newAnswer }
    })
  }

  const validate = () => {
    if (!form.category)       return 'Category is required.'
    if (!form.skill)          return 'Skill is required.'
    if (!form.classification) return 'Classification is required.'
    if (!form.level)          return 'Level is required.'
    if (!form.question.trim()) return 'Question text is required.'
    const filledOpts = form.options.filter(o => o.trim())
    if (filledOpts.length < 2) return 'At least 2 options are required.'
    if (!form.answer)         return 'Please select the correct answer.'
    if (!filledOpts.includes(form.answer)) return 'Answer must be one of the options.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setSaveErr(err); return }

    setSaveErr(null)
    setSaving(true)
    try {
      const payload = {
        ...form,
        options: form.options.filter(o => o.trim()),
        coins: Number(form.coins),
      }
      if (isEdit) {
        await updateQuestion(quizType, id, payload)
      } else {
        await createQuestion(quizType, payload)
      }
      navigate(`/admin/${quizType}/questions`)
    } catch (error) {
      setSaveErr(error?.response?.data?.message ?? 'Failed to save question.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout title={`${isEdit ? 'Edit' : 'Add'} Question`}>
      <p style={{ color: '#6b7280' }}>Loading...</p>
    </AdminLayout>
  )

  if (loadErr) return (
    <AdminLayout title="Edit Question">
      <p style={{ color: '#ef4444' }}>{loadErr}</p>
    </AdminLayout>
  )

  return (
    <AdminLayout title={`${isEdit ? 'Edit' : 'Add'} Question — ${quizLabel}`}>

      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#eef0f5', borderRadius: 8, padding: '12px 20px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 15, color: '#4338ca', fontWeight: 500 }}>
          <Link to="/admin/dashboard" style={{ color: '#4338ca', textDecoration: 'none' }}>Dashboard</Link>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>/</span>
          <Link to={`/admin/${quizType}/questions`} style={{ color: '#4338ca', textDecoration: 'none' }}>{quizLabel} Questions</Link>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>{isEdit ? 'Edit' : 'Add'} Question</span>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} style={{
        background: '#fff', borderRadius: 12, padding: '28px 32px',
        border: '1px solid #e5e7eb', maxWidth: 800,
      }}>

        {/* Row 1: Category / Skill */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 4 }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Category <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle} required>
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Skill <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={form.skill} onChange={e => set('skill', e.target.value)} style={inputStyle} required>
              <option value="">Select Skill</option>
              {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: Classification / Level */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 4 }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Classification <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={form.classification} onChange={e => set('classification', e.target.value)} style={inputStyle} required>
              <option value="">Select Classification</option>
              {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Level <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={form.level} onChange={e => set('level', e.target.value)} style={inputStyle} required>
              <option value="">Select Level</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3: Coins / Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 4 }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Coins <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="number" min={0} value={form.coins}
              onChange={e => set('coins', e.target.value)}
              style={inputStyle} required
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
              <option value="show">Show</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Image URL <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
          <input
            type="url" value={form.image}
            onChange={e => set('image', e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        {/* Question */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Question <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            value={form.question}
            onChange={e => set('question', e.target.value)}
            rows={3}
            placeholder="Enter the question text..."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            required
          />
        </div>

        {/* Options */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Options <span style={{ color: '#ef4444' }}>*</span> <span style={{ color: '#9ca3af', fontWeight: 400 }}>(2–5)</span></label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form.options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: form.answer === opt && opt.trim() ? '#4338ca' : '#e5e7eb',
                  color: form.answer === opt && opt.trim() ? '#fff' : '#6b7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  value={opt}
                  onChange={e => setOption(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                {/* Select as answer */}
                {opt.trim() && (
                  <button
                    type="button"
                    onClick={() => set('answer', opt)}
                    title="Mark as correct answer"
                    style={{
                      flexShrink: 0, border: 'none', borderRadius: 6,
                      padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      background: form.answer === opt ? '#16a34a' : '#f3f4f6',
                      color: form.answer === opt ? '#fff' : '#4b5563',
                    }}
                  >
                    {form.answer === opt ? '✓ Correct' : 'Set Correct'}
                  </button>
                )}
                {/* Remove option */}
                {form.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    title="Remove option"
                    style={{
                      flexShrink: 0, border: 'none', borderRadius: 6,
                      width: 32, height: 32, background: '#fee2e2', color: '#ef4444',
                      fontSize: 18, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {form.options.length < 5 && (
              <button
                type="button"
                onClick={addOption}
                style={{
                  alignSelf: 'flex-start', background: '#eef0f5', border: '1.5px dashed #c7d2fe',
                  borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700,
                  color: '#4338ca', cursor: 'pointer',
                }}
              >
                + Add Option
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {saveErr && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8,
            padding: '10px 14px', color: '#b91c1c', fontSize: 14, marginBottom: 18,
          }}>
            {saveErr}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate(`/admin/${quizType}/questions`)}
            style={{
              background: '#f3f4f6', color: '#374151', border: '1.5px solid #e5e7eb',
              borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: saving ? '#a5b4fc' : '#4338ca', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 32px', fontSize: 14, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : isEdit ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default AddQuestion
