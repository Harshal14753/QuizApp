import React, { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router'
import { UserDataContext } from '../context/UserContext'
import { getAdminProfile } from '../services/AdminService'

/**
 * ProtectedAdminRoute
 * - Validates the token against the backend
 * - If valid   → sets user in context and renders the page
 * - If invalid → removes token and redirects to /admin/login
 */
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const { setUser } = useContext(UserDataContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      setIsAuthorized(false)
      return
    }

    getAdminProfile(token)
      .then(data => {
        setUser(data.user || {})
        setIsAuthorized(true)
      })
      .catch(err => {
        console.error('Error fetching admin profile:', err)
        localStorage.removeItem('token')
        setIsAuthorized(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return null

  return isAuthorized ? children : <Navigate to="/admin/login" replace />
}

/**
 * PublicAdminRoute
 * - Validates the token against the backend
 * - If valid   → sets user in context and redirects to /admin/dashboard (already logged in)
 * - If invalid → removes token and renders the page (login page)
 */
export const PublicAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const { setUser } = useContext(UserDataContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      setIsAuthorized(false)
      return
    }

    getAdminProfile(token)
      .then(data => {
        setUser(data.user || {})
        setIsAuthorized(true)
      })
      .catch(err => {
        console.error('Error verifying admin token:', err)
        localStorage.removeItem('token')
        setIsAuthorized(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return null

  return isAuthorized ? <Navigate to="/admin/dashboard" replace /> : children
}

export default ProtectedAdminRoute
