import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/UserService'
import { toast } from 'react-toastify'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    if (!name) {
      newErrors.name = 'Full name is required'
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions'
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
      console.log('Register attempt:', { name, email, password })
      // Simulate API call
      const response = await registerUser({ name, email, password })
      if ( response.success ) {
        toast.success('Registration successful! Please log in.')
        navigate('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
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
          <p className="text-purple-100 mt-2">Join Our Learning Community!</p>
        </div>
      </div>

      {/* Registration Form Container */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">Join millions of learners worldwide</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.name
                    ? 'border-red-500 focus:border-red-600 bg-red-50'
                    : 'border-gray-300 focus:border-purple-600 bg-gray-50'
                } text-gray-800 placeholder-gray-400`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </div>

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
                  placeholder="Create a strong password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition pr-12 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-600 bg-red-50'
                      : 'border-gray-300 focus:border-purple-600 bg-gray-50'
                  } text-gray-800 placeholder-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 text-lg"
                >
                  {showConfirmPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded mt-1 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-600 font-medium">
                I agree to the <Link to="/terms" className="text-purple-600 hover:underline font-semibold">Terms & Conditions</Link> and <Link to="/privacy" className="text-purple-600 hover:underline font-semibold">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>⚠</span> {errors.agreeTerms}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>


          {/* Login Link */}
          <p className="text-center text-gray-600 my-3">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-600 font-bold hover:text-purple-700 transition hover:underline"
            >
              Sign In
            </Link>
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

export default Register