import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: Email, 2: Verification, 3: Reset Password
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [verificationMethod, setVerificationMethod] = useState('email') // email or SMS
  const [successMessage, setSuccessMessage] = useState('')

  const validateEmail = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCode = () => {
    const newErrors = {}
    if (!verificationCode) {
      newErrors.code = 'Verification code is required'
    } else if (verificationCode.length !== 6) {
      newErrors.code = 'Code must be 6 digits'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePassword = () => {
    const newErrors = {}
    if (!newPassword) {
      newErrors.password = 'New password is required'
    } else if (newPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    if (!validateEmail()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep(2)
      setErrors({})
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    if (!validateCode()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep(3)
      setErrors({})
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep3Submit = async (e) => {
    e.preventDefault()
    if (!validatePassword()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccessMessage('Password reset successfully! Redirecting to login...')
      // Simulate redirect
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Verification code sent to ' + (verificationMethod === 'email' ? email : 'your phone'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8 px-4">
        <div className="max-w-md mx-auto">
          <Link to="/login" className="flex items-center gap-2 mb-4">
            <span className="text-2xl">←</span>
            <span className="text-lg font-semibold">Back to Login</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h1 className="text-2xl font-bold">QuizMaster</h1>
          </div>
          <p className="text-purple-100 mt-2">Reset Your Password</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-green-700 font-semibold flex items-center gap-2">
                <span>✓</span> {successMessage}
              </p>
            </div>
          )}

          {/* Step 1: Email Verification */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">1</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Email</p>
                  </div>
                  <div className="flex-1 flex items-start justify-center pt-4 px-2">
                    <div className="w-full h-1 bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-lg">2</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Verify</p>
                  </div>
                  <div className="flex-1 flex items-start justify-center pt-4 px-2">
                    <div className="w-full h-1 bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-lg">3</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Reset</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Your Account</h2>
              <p className="text-gray-500 mb-6">Enter your email address associated with your QuizMaster account</p>

              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Searching...
                    </span>
                  ) : (
                    'Search Account'
                  )}
                </button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-purple-600 font-bold hover:text-purple-700 transition hover:underline"
                >
                  Create one
                </Link>
              </p>
            </>
          )}

          {/* Step 2: Code Verification */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">✓</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Email</p>
                  </div>
                  <div className="flex-1 flex items-start justify-center pt-4 px-2">
                    <div className="w-full h-1 bg-purple-600"></div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">2</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Verify</p>
                  </div>
                  <div className="flex-1 flex items-start justify-center pt-4 px-2">
                    <div className="w-full h-1 bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-lg">3</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Reset</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Identity</h2>
              <p className="text-gray-500 mb-6">We've sent a verification code to {email}</p>

              {/* Verification Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setVerificationMethod('email')}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${
                    verificationMethod === 'email'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📧 Email
                </button>
                <button
                  onClick={() => setVerificationMethod('sms')}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${
                    verificationMethod === 'sms'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📱 SMS
                </button>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-5">
                <div>
                  <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-center text-2xl tracking-widest font-bold ${
                      errors.code
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-gray-300 focus:border-purple-600 bg-gray-50'
                    } text-gray-800`}
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.code}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-purple-600 font-bold hover:text-purple-700 transition hover:underline disabled:opacity-75"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Verifying...
                    </span>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-purple-600 font-semibold hover:text-purple-700 transition"
                >
                  ← Change Email
                </button>
              </div>
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <>
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">✓</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Email</p>
                  </div>
                  <div className="flex-1 flex items-start justify-center pt-4 px-2">
                    <div className="w-full h-1 bg-purple-600"></div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">✓</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Verify</p>
                  </div>
                  <div className="flex-1 flex items-start justify-center pt-4 px-2">
                    <div className="w-full h-1 bg-purple-600"></div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">3</div>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Reset</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Password</h2>
              <p className="text-gray-500 mb-6">Enter a strong password for your account</p>

              <form onSubmit={handleStep3Submit} className="space-y-5">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  <p className="text-xs text-gray-500 mt-2">Use at least 6 characters with a mix of letters and numbers</p>
                </div>

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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full px-4 py-6 text-center text-gray-500 text-sm">
        <p>© 2026 QuizMaster. All rights reserved.</p>
      </div>
    </div>
  )
}

export default ForgotPassword