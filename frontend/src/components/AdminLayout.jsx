import React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../services/AdminService'

// ── Inline SVG icon wrapper ───────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
)

const ICONS = {
  home:         'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  menu:         'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
  users:        'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  question:     'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
  leaderboard:  'M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z',
  settings:     'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.22-.07.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61L19.14 12.94zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  chevronDown:  'M7 10l5 5 5-5z',
  person:       'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  translate:    'M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
  category:     'M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8.5v7L12 19.82 4 15.5v-7L12 4.18z',
  bulb:         'M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z',
  grid:         'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
  layers:       'M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z',
  star:         'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z',
  shield:       'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  box:          'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.1 15.9 0 13.36 0c-1.3 0-2.48.52-3.36 1.36L9 2.36 7.99 1.36C7.11.52 5.94 0 4.64 0 2.1 0 0 2.1 0 4.64c0 .48.11.92.18 1.36H0v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z',
  work:         'M20 6H16V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
  target:       'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5S9.51 16.5 12 16.5s4.5-2.01 4.5-4.5S14.49 7.5 12 7.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
const NavItem = ({ iconKey, label, to }) => {
  const location = useLocation()
  const active = location.pathname === to
  const itemRef = useRef(null)

  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [active])

  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div ref={itemRef} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 16px', cursor: 'pointer', borderRadius: 6, margin: '1px 8px',
        background: active ? '#4338ca' : 'transparent',
        color: active ? '#fff' : '#1f2937',
      }}>
        {iconKey && (
          <span style={{ color: active ? '#fff' : '#374151', display: 'flex' }}>
            <Icon d={ICONS[iconKey]} size={20} />
          </span>
        )}
        <span style={{ fontSize: 18, fontWeight: 700 }}>{label}</span>
      </div>
    </Link>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ label }) => (
  <div style={{
    padding: '14px 16px 2px', fontSize: 15, color: '#6b7280',
    fontWeight: 700, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6,
  }}>
    <span>{label}</span>
    <span style={{ flex: 1, borderBottom: '1.5px dashed #d1d5db' }} />
  </div>
)

// ── Dropdown nav item ─────────────────────────────────────────────────────────
const NavDropdownItem = ({ item }) => {
  const location = useLocation()
  const active = location.pathname === item.to
  const itemRef = useRef(null)

  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [active])

  return (
    <Link to={item.to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div ref={itemRef} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 16px', cursor: 'pointer', borderRadius: 6, margin: '1px 8px',
        background: active ? '#e0e7ff' : 'transparent',
        color: active ? '#4338ca' : '#374151',
      }}>
        {item.iconKey && (
          <span style={{ display: 'flex' }}>
            <Icon d={ICONS[item.iconKey]} size={17} />
          </span>
        )}
        <span style={{ fontSize: 18, fontWeight: 700 }}>{item.label}</span>
      </div>
    </Link>
  )
}

// ── Dropdown nav group ────────────────────────────────────────────────────────
const NavDropdown = ({ iconKey, label, items }) => {
  const location = useLocation()
  const isAnyActive = items.some(i => location.pathname === i.to)
  const [open, setOpen] = useState(isAnyActive)

  return (
    <div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 16px', cursor: 'pointer', borderRadius: 6, margin: '1px 8px',
          background: 'transparent', color: '#1f2937', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {iconKey && (
            <span style={{ color: '#374151', display: 'flex' }}>
              <Icon d={ICONS[iconKey]} size={20} />
            </span>
          )}
          <span style={{ fontSize: 18, fontWeight: 700 }}>{label}</span>
        </div>
        <span style={{ display: 'flex', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <Icon d={ICONS.chevronDown} size={22} />
        </span>
      </div>
      {open && (
        <div style={{ paddingLeft: 16 }}>
          {items.map(item => (
            <NavDropdownItem key={item.to} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = () => (
  <div style={{
    width: 260, minWidth: 260, height: '100%', background: '#fff',
    borderRight: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column',
    overflowY: 'auto',
  }}>
    {/* Logo row */}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', borderBottom: '1px solid #e5e7eb', flexShrink: 0,
    }}>
      <span style={{ fontSize: 24, fontWeight: 800, color: '#1f2937' }}>QuizMaster</span>
      <span style={{ color: '#374151', display: 'flex', cursor: 'pointer' }}>
        <Icon d={ICONS.menu} size={22} />
      </span>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, paddingTop: 6, paddingBottom: 16 }}>
      <NavItem iconKey="home" label="Dashboard" to="/admin/dashboard" />

      <SectionLabel label="Basic Element" />
      <NavDropdown
        iconKey="settings"
        label="Basic Items"
        items={[
          { iconKey: 'category', label: 'Category',       to: '/admin/basic-items/category' },
          { iconKey: 'bulb',     label: 'Skill',          to: '/admin/basic-items/skills' },
          { iconKey: 'grid',     label: 'Classification', to: '/admin/basic-items/classification' },
          { iconKey: 'layers',   label: 'Level',          to: '/admin/basic-items/level' },
          { iconKey: 'star',     label: 'Avatar',         to: '/admin/basic-items/avatar' },
        ]}
      />
      <NavItem iconKey="users" label="Users" to="/admin/users" />

      <SectionLabel label="Practice Quiz" />
      <NavItem iconKey="question"    label="Questions"   to="/admin/practice-quiz/questions" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/practice-quiz/leaderboard" />

      <SectionLabel label="Normal Quiz" />
      <NavItem iconKey="question"    label="Questions"   to="/admin/normal-quiz/questions" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/normal-quiz/leaderboard" />

      <SectionLabel label="Audio Quiz" />
      <NavItem iconKey="question"    label="Questions"   to="/admin/audio-quiz/questions" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/audio-quiz/leaderboard" />

      <SectionLabel label="Video Quiz" />
      <NavItem iconKey="question"    label="Questions"   to="/admin/video-quiz/questions" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/video-quiz/leaderboard" />

      <SectionLabel label="True / False" />
      <NavItem iconKey="question"    label="Questions"   to="/admin/true-false/questions" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/true-false/leaderboard" />

      <SectionLabel label="Daily Quiz" />
      <NavItem iconKey="question"    label="Questions"   to="/admin/daily-quiz/questions" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/daily-quiz/leaderboard" />

      <SectionLabel label="Fear Factor" />
      <NavItem iconKey="question"    label="Questions"   to="/admin/fear-factor/questions" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/fear-factor/leaderboard" />

      <SectionLabel label="Contests" />
      <NavItem iconKey="shield"      label="Contests"    to="/admin/contests" />
      <NavItem iconKey="leaderboard" label="Leaderboard" to="/admin/contests/leaderboard" />

      <SectionLabel label="Settings" />
      <NavItem iconKey="settings" label="Settings" to="/admin/settings" />
    </nav>
  </div>
)

// ── Top bar ───────────────────────────────────────────────────────────────────
const TopBar = ({ title }) => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const adminUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('adminUser') || '{}') } catch { return {} }
  }, [])

  const initials = (adminUser.name || 'A')
    .split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('')

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      await logout(token)
    } catch (error) {
      // ignore errors on logout
      console.error('Logout failed:', error)
    } finally {
      navigate('/admin/login')
    }
  }

  return (
    <div style={{
      height: 76, background: '#fff', borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', flexShrink: 0,
    }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{
          background: '#4338ca', color: '#fff', border: 'none', borderRadius: 6,
          padding: '8px 18px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
        }}>Demo Mode</button>
        <button style={{
          background: '#4338ca', color: '#fff', border: 'none', borderRadius: 6,
          padding: '7px 12px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon d={ICONS.translate} size={16} />
          <span>A Z</span>
        </button>

        {/* ── Profile button + dropdown ── */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: '#4338ca', border: 'none', borderRadius: '50%',
              width: 38, height: 38, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: '#fff',
              fontSize: 14, fontWeight: 700, letterSpacing: 0.5,
            }}
          >
            {initials || <Icon d={ICONS.person} size={20} />}
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.13)',
              border: '1px solid #e5e7eb', minWidth: 200, zIndex: 100, overflow: 'hidden',
            }}>
              {/* Admin info header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', background: '#f9fafb' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{adminUser.name || 'Admin'}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{adminUser.email || ''}</div>
              </div>

              {/* Profile option */}
              <button
                onClick={() => { setMenuOpen(false); navigate('/admin/profile') }}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px',
                  border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 14, color: '#374151', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Icon d={ICONS.person} size={17} />
                Profile
              </button>

              {/* Logout option */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px',
                  border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 14, color: '#dc2626', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderTop: '1px solid #f0f0f0',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Layout wrapper ────────────────────────────────────────────────────────────
const AdminLayout = ({ title = 'Dashboard', children }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    display: 'flex', overflow: 'hidden', zIndex: 9999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }}>
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f9fafb' }}>
      <TopBar title={title} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {children}
      </div>
    </div>
  </div>
)

export default AdminLayout
