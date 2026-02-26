import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginAdmin } from '../../services/AdminService'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const response = await loginAdmin({ email, password })
      console.log('Login response:', response)
      if (response.success) {
        localStorage.setItem('token', response.token)
        // localStorage.setItem('adminUser', JSON.stringify(response.user))
        toast.success('Welcome, Admin!')
        navigate('/admin/dashboard')
      } else {
        toast.error(response.message || 'Invalid credentials')
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Login failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden', zIndex: 9999 }}>
      {/* ── Left Panel ── */}
      <div
        style={{
          width: '33%',
          height: '100%',
          backgroundImage: 'url("https://dtquiz.divinetechs.com/storage/app/public/setting/panel_2025_10_14_68edec2c2c616.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          boxSizing: 'border-box',
        }}
      >
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          zIndex: 0,
        }} />

        {/* Brand name */}
        <h1 style={{ fontSize: 42, fontWeight: 800, color: '#ffffff', letterSpacing: 2, margin: '0 0 32px', position: 'relative', zIndex: 1 }}>
          Quiz<span style={{ color: '#22d3ee' }}>Master</span>
        </h1>

        {/* Description */}
        <p style={{
          textAlign: 'center', color: '#e2e8f0', fontSize: 14,
          lineHeight: 1.8, maxWidth: 300, margin: 0, position: 'relative', zIndex: 1,
        }}>
          Divinetechs is an IT company specializing in providing technology
          solutions and services. The company likely focuses on various aspects of
          IT, such as software development, web and mobile app development, IT
          consulting, cloud solutions, and possibly more. Divinetechs aims to
          leverage technology to drive business growth and efficiency for its
          clients, offering innovative and customized solutions tailored to meet
          specific business needs.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        width: '60%',
        height: '100%',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#4338ca', marginBottom: 8, marginTop: 0 }}>Login</h2>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Welcome back, Admin</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 36px' }}>Sign In to Your Account.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Fields row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              {/* Email */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 8,
                    border: errors.email ? '1.5px solid #f87171' : '1.5px solid #d1d5db',
                    backgroundColor: '#ffffff', fontSize: 14, color: '#1f2937',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {errors.email && (
                  <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 8,
                    border: errors.password ? '1.5px solid #f87171' : '1.5px solid #d1d5db',
                    backgroundColor: '#ffffff', fontSize: 14, color: '#1f2937',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {errors.password && (
                  <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div style={{ marginTop: 28 }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 40px', backgroundColor: isLoading ? '#6366f1' : '#4338ca',
                  color: '#ffffff', fontWeight: 600, fontSize: 16,
                  border: 'none', borderRadius: 50, cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(67,56,202,0.4)',
                  transition: 'background-color 0.2s',
                }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Help link */}
          <p style={{ marginTop: 36, fontSize: 14, color: '#374151' }}>
            If you cannot login, then{' '}
            <Link to="/forgot-password" style={{ color: '#4338ca', fontWeight: 600, textDecoration: 'none' }}>
              Click Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
