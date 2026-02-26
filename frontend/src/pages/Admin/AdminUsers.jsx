import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import AdminLayout from '../../components/AdminLayout'
import { getAllUsers, deleteUser } from '../../services/AdminService'

// ── Icon helper ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
)

const ICONS = {
  sort:   'M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z',
  search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  edit:   'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 1.42L14.06 10.5l.44.44-8.25 8.25H5.92v-.52zM20.71 5.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  stats:  'M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z',
  excel:  'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10l-2-3-2 3H9l3-4.5L9 5h4l2 3 2-3h4l-3 4.5 3 4.5h-4z',
  csv:    'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  pdf:    'M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z',
  info:   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  adduser:'M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  chevUp: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
  chevDn: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
}

// ── Avatar colors ──────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#db2777', '#9333ea', '#16a34a', '#ea580c',
]

const getAvatarColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

// ── Helpers ────────────────────────────────────────────────────────────────────
const maskEmail = (email = '') => {
  const [local, domain] = email.split('@')
  if (!domain) return email
  return `${local[0]}******@${domain}`
}

const formatDate = (iso = '') => {
  if (!iso) return '—'
  return new Date(iso).toISOString().slice(0, 10)
}

const makeUsername = (name = '', id = '') =>
  `@${name.toLowerCase().replace(/\s+/g, '')}${id.slice(-4)}`

// ── Google "G" type badge ──────────────────────────────────────────────────────
const GIcon = () => (
  <svg viewBox="0 0 48 48" width={28} height={28}>
    <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.5 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.2-.1-2.4-.4-3.5z"/>
    <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.5 6.3 14.7z"/>
    <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.5-3.1-11.3-7.5l-6.6 5.1C9.6 39.4 16.3 44 24 44z"/>
    <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.2 5.2C40 36.1 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z"/>
  </svg>
)

// ── Sort indicator ─────────────────────────────────────────────────────────────
const SortBtn = ({ col, sortCol, sortDir, onSort }) => (
  <button
    onClick={() => onSort(col)}
    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', verticalAlign: 'middle', color: sortCol === col ? '#4338ca' : '#9ca3af' }}
  >
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d={sortCol === col && sortDir === 'asc' ? ICONS.chevUp : sortCol === col && sortDir === 'desc' ? ICONS.chevDn : 'M7 14l5-5 5 5z M7 10l5 5 5-5z'} />
    </svg>
  </button>
)

// ── Main component ─────────────────────────────────────────────────────────────
const AdminUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [filterType, setFilterType] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllUsers()
      console.log("All users ", data)
      setUsers(data?.users || [])
    } catch (err) {
      setError('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const handleDelete = async (id) => {
    try {
      await deleteUser(id)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch {
      alert('Failed to delete user.')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const filtered = useMemo(() => {
    let list = [...users]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      let va = sortCol === 'name' ? a.name?.toLowerCase() : a.createdAt
      let vb = sortCol === 'name' ? b.name?.toLowerCase() : b.createdAt
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [users, search, sortCol, sortDir])

  // ── CSV export ──────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const header = ['#', 'Name', 'Email', 'Register Date', 'Status']
    const rows = filtered.map((u, i) => [
      i + 1, u.name, u.email, formatDate(u.createdAt), 'Active'
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    btn: (color = '#4338ca') => ({
      background: color, color: '#fff', border: 'none', borderRadius: 7,
      padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }),
    iconBtn: (bg = '#4338ca') => ({
      background: bg, color: '#fff', border: 'none', borderRadius: 7,
      width: 34, height: 34, display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer',
    }),
    th: {
      padding: '13px 14px', textAlign: 'left', fontWeight: 700,
      fontSize: 14, color: '#374151', borderBottom: '2px solid #e5e7eb',
      background: '#f9fafb', whiteSpace: 'nowrap',
    },
    td: {
      padding: '12px 14px', fontSize: 14, color: '#374151',
      borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
    },
  }

  return (
    <AdminLayout title="Users">
      {/* ── Breadcrumb + Add User ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 18, background: '#eef0f5', borderRadius: 8, padding: '12px 20px' }}>
        <span style={{ fontSize: 15, color: '#374151' }}>
          <span style={{ color: '#6b7280' }}>Dashboard</span>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>/</span>
          <span style={{ fontWeight: 600, color: '#1f2937' }}>Users</span>
        </span>
      </div>

      {/* ── Export info bar ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 20px', marginBottom: 18 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#6b7280' }}>
          <span style={{ background: '#e5e7eb', borderRadius: '50%', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={ICONS.info} size={16} />
          </span>
          Only the following data will be captured in this File.
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'MS-Excel', icon: ICONS.excel },
            { label: 'CSV',      icon: ICONS.csv,   action: exportCSV },
            { label: 'PDF',      icon: ICONS.pdf },
          ].map(({ label, icon, action }) => (
            <button key={label} onClick={action} style={S.btn()}>
              <Icon d={icon} size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Filters ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 20px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, border: '1px solid #e5e7eb', borderRadius: 7, padding: '7px 14px', background: '#f9fafb' }}>
          <Icon d={ICONS.search} size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: '#374151' }}
          />
        </div>
        <span style={{ fontSize: 14, color: '#374151', fontWeight: 600, whiteSpace: 'nowrap' }}>Sort by :</span>
        <select
          value={sortCol}
          onChange={e => setSortCol(e.target.value)}
          style={{ border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 12px', fontSize: 14, color: '#374151', background: '#fff', cursor: 'pointer' }}
        >
          <option value="createdAt">All Users</option>
          <option value="name">Name</option>
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{ border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 12px', fontSize: 14, color: '#374151', background: '#fff', cursor: 'pointer' }}
        >
          <option value="all">All Type</option>
          <option value="google">Google</option>
          <option value="email">Email</option>
        </select>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#6b7280', fontSize: 15 }}>Loading users…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#dc2626', fontSize: 15 }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr>
                  {[
                    { label: '#',               col: null },
                    { label: 'Image',            col: null },
                    { label: 'Name',             col: 'name' },
                    { label: 'Contact',          col: null },
                    { label: 'Register Date',    col: 'createdAt' },
                    { label: 'Type',             col: null },
                    { label: 'Status',           col: null },
                    { label: 'Action',           col: null },
                  ].map(({ label, col }) => (
                    <th key={label} style={S.th}>
                      {label}
                      {col && (
                        <SortBtn col={col} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 15 }}>
                      No users found.
                    </td>
                  </tr>
                ) : filtered.map((user, idx) => {
                  const initials   = getInitials(user.name)
                  const avatarColor = getAvatarColor(user._id || user.name)
                  const username   = makeUsername(user.name, user._id)
                  const masked     = maskEmail(user.email)
                  const regDate    = formatDate(user.createdAt)

                  return (
                    <tr key={user._id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                      {/* # */}
                      <td style={{ ...S.td, width: 48, fontWeight: 600 }}>{idx + 1}</td>

                      {/* Avatar */}
                      <td style={S.td}>
                        <div style={{
                          width: 46, height: 46, borderRadius: '50%',
                          background: avatarColor, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, fontWeight: 700, letterSpacing: 0.5,
                        }}>
                          {initials}
                        </div>
                      </td>

                      {/* Name + username */}
                      <td style={S.td}>
                        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>{username}</div>
                        <div style={{ fontWeight: 700, color: '#111827' }}>{user.name}</div>
                      </td>

                      {/* Contact */}
                      <td style={S.td}>
                        <span style={{ color: '#4338ca', fontWeight: 500 }}>{masked}</span>
                      </td>

                      {/* Register Date */}
                      <td style={{ ...S.td, whiteSpace: 'nowrap' }}>{regDate}</td>

                      {/* Type */}
                      <td style={S.td}><GIcon /></td>

                      {/* Status */}
                      <td style={S.td}>
                        <span style={{
                          background: '#16a34a', color: '#fff',
                          borderRadius: 6, padding: '4px 14px',
                          fontSize: 13, fontWeight: 700,
                        }}>
                          Active
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', gap: 7 }}>
                          <button title="View Stats"  style={S.iconBtn('#4338ca')}>
                            <Icon d={ICONS.stats} size={16} />
                          </button>
                          <button title="Edit User" style={S.iconBtn('#4338ca')} onClick={() => navigate(`/admin/users/${user._id}/edit`)}>
                            <Icon d={ICONS.edit} size={16} />
                          </button>
                          <button
                            title="Delete User"
                            style={S.iconBtn('#4338ca')}
                            onClick={() => setDeleteConfirm(user._id)}
                          >
                            <Icon d={ICONS.delete} size={16} />
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
      </div>

      {/* ── Delete confirm modal ──────────────────────────────────────────── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '32px 36px', maxWidth: 380,
            width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Delete User</div>
            <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 24 }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...S.btn('#6b7280') }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ ...S.btn('#dc2626') }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminUsers
