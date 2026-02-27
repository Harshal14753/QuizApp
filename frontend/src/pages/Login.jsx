import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginUser } from '../services/UserService'
import { UserDataContext } from '../context/UserContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const {user, setUser} = React.useContext(UserDataContext)

  const validateForm = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // API call will go here
      // console.log('Login attempt:', { email, password, rememberMe })
      // Simulate API call
      
      const response = await loginUser({ email, password })
      
      if (response.success) {
        // Save token to localStorage or context
        localStorage.setItem('token', response.token)
        setUser(response.user)
        toast.success('Login successful! Redirecting to home page...')
        // Redirect to home page
        navigate('/home')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8 px-4">
        <div className="max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="text-2xl">←</span>
            <span className="text-lg font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h1 className="text-2xl font-bold">QuizMaster</h1>
          </div>
          <p className="text-purple-100 mt-2">Welcome Back!</p>
        </div>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-500 mb-6">Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.email
                    ? 'border-red-500 focus:border-red-600 bg-red-50'
                    : 'border-gray-300 focus:border-purple-600 bg-gray-50'
                } text-gray-800 placeholder-gray-400`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition pr-12 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-600 bg-red-50'
                      : 'border-gray-300 focus:border-purple-600 bg-gray-50'
                  } text-gray-800 placeholder-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 text-lg"
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 font-semibold hover:text-purple-700 transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>


          {/* Sign Up Link */}
          <p className="text-center text-gray-600 my-3">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-purple-600 font-bold hover:text-purple-700 transition hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-gray-700">
          <p>
            <span className="font-semibold">Demo Credentials:</span>
            <br />
            Email: demo@quizmaster.com
            <br />
            Password: demo123
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full px-4 py-6 text-center text-gray-500 text-sm">
        <p>© 2026 QuizMaster. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Login