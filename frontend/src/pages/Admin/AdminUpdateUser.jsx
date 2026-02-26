import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import AdminLayout from '../../components/AdminLayout'
import { getUserById, updateUser } from '../../services/AdminService'

// ── Icon helper ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
)

const ICONS = {
  person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  email:  'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  back:   'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  save:   'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z',
  check:  'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
}

// ── Avatar helpers ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#db2777', '#9333ea', '#16a34a', '#ea580c',
]
const getAvatarColor = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

// ── Field component ────────────────────────────────────────────────────────────
const Field = ({ label, iconD, type = 'text', name, value, onChange, disabled, required }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', letterSpacing: 0.3 }}>
      {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
    </label>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      border: '1.5px solid #e5e7eb', borderRadius: 8,
      padding: '10px 14px', background: disabled ? '#f3f4f6' : '#fff',
      transition: 'border-color 0.15s',
    }}
      onFocus={e => !disabled && (e.currentTarget.style.borderColor = '#4338ca')}
      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
    >
      <span style={{ color: '#9ca3af', display: 'flex', flexShrink: 0 }}>
        <Icon d={iconD} size={18} />
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={{
          flex: 1, border: 'none', outline: 'none',
          fontSize: 15, color: disabled ? '#9ca3af' : '#111827',
          background: 'transparent',
        }}
      />
    </div>
  </div>
)

// ── Main component ─────────────────────────────────────────────────────────────
const AdminUpdateUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '' })
  const [original, setOriginal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await getUserById(id)
        const u = data?.user
        setOriginal(u)
        setForm({ name: u?.name || '', email: u?.email || '' })
      } catch {
        setError('Failed to load user data.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }
    try {
      setSaving(true)
      setError(null)
      await updateUser(id, { name: form.name.trim(), email: form.email.trim() })
      setSuccess(true)
      setTimeout(() => navigate('/admin/users'), 1200)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update user.')
    } finally {
      setSaving(false)
    }
  }

  const isDirty = original && (form.name !== original.name || form.email !== original.email)

  return (
    <AdminLayout title="Update User">
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div style={{ background: '#eef0f5', borderRadius: 8, padding: '12px 20px', marginBottom: 24 }}>
        <span style={{ fontSize: 15, color: '#374151' }}>
          <span style={{ color: '#6b7280' }}>Dashboard</span>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>/</span>
          <span
            onClick={() => navigate('/admin/users')}
            style={{ color: '#4338ca', cursor: 'pointer', fontWeight: 500 }}
          >
            Users
          </span>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>/</span>
          <span style={{ fontWeight: 600, color: '#1f2937' }}>Update User</span>
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#6b7280', fontSize: 15 }}>
          Loading user data…
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>

          {/* ── Left: user card ───────────────────────────────────────── */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, textAlign: 'center' }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: getAvatarColor(original?._id || original?.name || ''),
              color: '#fff', fontSize: 30, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {getInitials(form.name || original?.name || '')}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              {form.name || original?.name || '—'}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
              {form.email || original?.email || '—'}
            </div>
            <span style={{
              background: '#16a34a', color: '#fff', borderRadius: 6,
              padding: '4px 18px', fontSize: 13, fontWeight: 700,
            }}>Active</span>
            <div style={{ marginTop: 20, fontSize: 12, color: '#9ca3af', borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
              <div>Registered</div>
              <div style={{ fontWeight: 600, color: '#374151', marginTop: 2 }}>
                {original?.createdAt ? new Date(original.createdAt).toISOString().slice(0, 10) : '—'}
              </div>
            </div>
          </div>

          {/* ── Right: form ───────────────────────────────────────────── */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 24 }}>
              Edit User Information
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Field
                label="Full Name"
                iconD={ICONS.person}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Field
                label="Email Address"
                iconD={ICONS.email}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Read-only role */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Role</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  border: '1.5px solid #e5e7eb', borderRadius: 8,
                  padding: '10px 14px', background: '#f3f4f6',
                }}>
                  <span style={{ color: '#9ca3af', display: 'flex' }}>
                    <Icon d={ICONS.person} size={18} />
                  </span>
                  <span style={{ fontSize: 15, color: '#9ca3af', textTransform: 'capitalize' }}>
                    {original?.role || 'user'}
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 8, padding: '12px 16px', color: '#dc2626', fontSize: 14,
                }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  borderRadius: 8, padding: '12px 16px', color: '#16a34a',
                  fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Icon d={ICONS.check} size={18} />
                  User updated successfully! Redirecting…
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => navigate('/admin/users')}
                  style={{
                    flex: 1, padding: '11px 0', borderRadius: 8, border: '1.5px solid #e5e7eb',
                    background: '#fff', color: '#374151', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  }}
                >
                  <Icon d={ICONS.back} size={17} />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={saving || !isDirty}
                  style={{
                    flex: 2, padding: '11px 0', borderRadius: 8, border: 'none',
                    background: saving || !isDirty ? '#a5b4fc' : '#4338ca',
                    color: '#fff', fontSize: 15, fontWeight: 600,
                    cursor: saving || !isDirty ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'background 0.15s',
                  }}
                >
                  <Icon d={ICONS.save} size={17} />
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminUpdateUser
