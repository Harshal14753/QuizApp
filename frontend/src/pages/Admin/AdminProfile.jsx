import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import AdminLayout from '../../components/AdminLayout'
import { changeAdminPassword, getAdminProfile } from '../../services/AdminService'

// ── Icon helper ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
)

const ICONS = {
  person:  'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  email:   'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  lock:    'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
  eye:     'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  eyeOff:  'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
  shield:  'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  check:   'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  save:    'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z',
  calendar:'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
}

// ── Avatar colors ──────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#7c3aed','#2563eb','#0891b2','#059669','#d97706','#dc2626','#9333ea']
const getAvatarColor = (str = '') => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

// ── Read-only info row ─────────────────────────────────────────────────────────
const InfoField = ({ label, iconD, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      border: '1.5px solid #e5e7eb', borderRadius: 8,
      padding: '10px 14px', background: '#f3f4f6',
    }}>
      <span style={{ color: '#9ca3af', display: 'flex', flexShrink: 0 }}>
        <Icon d={iconD} size={17} />
      </span>
      <span style={{ fontSize: 15, color: '#6b7280' }}>{value || '—'}</span>
    </div>
  </div>
)

// ── Password input with toggle ─────────────────────────────────────────────────
const PasswordField = ({ label, name, value, onChange, required }) => {
  const [visible, setVisible] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        border: '1.5px solid #e5e7eb', borderRadius: 8,
        padding: '10px 14px', background: '#fff',
      }}
        onFocus={e => e.currentTarget.style.borderColor = '#4338ca'}
        onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
      >
        <span style={{ color: '#9ca3af', display: 'flex', flexShrink: 0 }}>
          <Icon d={ICONS.lock} size={17} />
        </span>
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#111827', background: 'transparent' }}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 0 }}
        >
          <Icon d={visible ? ICONS.eyeOff : ICONS.eye} size={17} />
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
const AdminProfile = () => {
  const navigate = useNavigate()

  const [adminUser, setAdminUser] = useState({})
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  useEffect(async () => {
    const token = localStorage.getItem('token')
    setProfileLoading(true)
    await getAdminProfile(token)
      .then(data => {
        setAdminUser(data.user || {})
      })
      .catch(err => {
        setProfileError(err?.response?.data?.message || 'Failed to load profile.')
      })
      .finally(() => setProfileLoading(false))
  }, [])

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handlePwChange = e => {
    setPwForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
    setSuccess(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setError('All password fields are required.'); return
    }
    if (pwForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters.'); return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setError('New password and confirm password do not match.'); return
    }
    try {
      setSaving(true)
      await changeAdminPassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      })
      setSuccess(true)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update password.')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (iso) => iso ? new Date(iso).toISOString().slice(0, 10) : '—'

  if (profileLoading) return (
    <AdminLayout title="Profile">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, fontSize: 15, color: '#6b7280' }}>
        Loading profile…
      </div>
    </AdminLayout>
  )

  if (profileError) return (
    <AdminLayout title="Profile">
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '14px 20px', color: '#dc2626', fontSize: 14 }}>
        {profileError}
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout title="Profile">
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div style={{ background: '#eef0f5', borderRadius: 8, padding: '12px 20px', marginBottom: 24 }}>
        <span style={{ fontSize: 15 }}>
          <span style={{ color: '#6b7280' }}>Dashboard</span>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>/</span>
          <span style={{ fontWeight: 600, color: '#1f2937' }}>Profile</span>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left: avatar card ─────────────────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, textAlign: 'center' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: getAvatarColor(adminUser.id || adminUser.name || 'admin'),
            color: '#fff', fontSize: 30, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            {getInitials(adminUser.name || 'Admin')}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{adminUser.name || '—'}</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{adminUser.email || '—'}</div>
          <span style={{
            background: '#4338ca', color: '#fff', borderRadius: 6,
            padding: '4px 20px', fontSize: 13, fontWeight: 700, textTransform: 'capitalize',
          }}>
            {adminUser.role || 'admin'}
          </span>
          <div style={{ marginTop: 20, fontSize: 12, color: '#9ca3af', borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
            <div>Admin ID</div>
            <div style={{ fontWeight: 600, color: '#374151', marginTop: 2, fontSize: 11, wordBreak: 'break-all' }}>
              {adminUser.id || '—'}
            </div>
          </div>
        </div>

        {/* ── Right: info + password ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Admin info card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={ICONS.person} size={18} />
              Admin Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <InfoField label="Full Name"  iconD={ICONS.person}   value={adminUser.name} />
              <InfoField label="Email"      iconD={ICONS.email}    value={adminUser.email} />
              <InfoField label="Role"       iconD={ICONS.shield}   value={adminUser.role} />
              <InfoField label="Admin ID"   iconD={ICONS.calendar} value={adminUser.id} />
            </div>
          </div>

          {/* Change password card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={ICONS.lock} size={18} />
              Change Password
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PasswordField label="Current Password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <PasswordField label="New Password"     name="newPassword"     value={pwForm.newPassword}     onChange={handlePwChange} required />
                <PasswordField label="Confirm Password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} required />
              </div>

              {/* Alert */}
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '11px 14px', color: '#dc2626', fontSize: 14 }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '11px 14px', color: '#16a34a', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon d={ICONS.check} size={17} />
                  Password updated successfully!
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  style={{
                    padding: '10px 24px', borderRadius: 8, border: '1.5px solid #e5e7eb',
                    background: '#fff', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                    background: saving ? '#a5b4fc' : '#4338ca', color: '#fff',
                    fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  }}
                >
                  <Icon d={ICONS.save} size={16} />
                  {saving ? 'Saving…' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile
