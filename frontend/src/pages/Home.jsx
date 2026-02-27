import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { getQuizTypes, getCategories } from '../services/UserService'

const QUIZ_TYPE_META = {
    'Practice Quiz':  { icon: '✏️', bgColor: 'bg-red-400',    description: 'Practice with unlimited attempts' },
    'Normal Quiz':    { icon: '🧠', bgColor: 'bg-amber-400',  description: 'Test your skills' },
    'Audio Quiz':     { icon: '🎧', bgColor: 'bg-teal-500',   description: 'Learn by listening' },
    'Video Quiz':     { icon: '🎥', bgColor: 'bg-indigo-600', description: 'Learn through videos' },
    'True / False':   { icon: '✅', bgColor: 'bg-green-500',  description: 'True or false challenges' },
    'Daily Quiz':     { icon: '📅', bgColor: 'bg-blue-500',   description: 'Daily challenge questions' },
    'Fear Factor':    { icon: '😱', bgColor: 'bg-purple-600', description: 'Dare to answer!' },
}

const Home = () => {
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState('home')
    const [quizTypes, setQuizTypes] = useState([])
    const [loadingTypes, setLoadingTypes] = useState(true)
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)

    const {user, setUser} = React.useContext(UserDataContext)

    useEffect(() => {
        const fetchQuizTypes = async () => {
            try {
                const data = await getQuizTypes()
                if (data.success) {
                    const mapped = data.quizTypes.map((type, idx) => {
                        const meta = QUIZ_TYPE_META[type] || { icon: '📝', bgColor: 'bg-gray-500', description: 'Start the quiz' }
                        return { id: idx + 1, title: type, ...meta }
                    })
                    setQuizTypes(mapped)
                }
            } catch (error) {
                console.error('Failed to fetch quiz types:', error)
            } finally {
                setLoadingTypes(false)
            }
        }
        fetchQuizTypes()
    }, [])

    const CATEGORY_COLORS = [
        'bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-pink-500',
        'bg-cyan-500', 'bg-yellow-500', 'bg-rose-500', 'bg-violet-500'
    ]

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories()
                if (data.success) {
                    setCategories(data.categories)
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [])

    const navItems = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'favorites', icon: '⭐', label: 'Favorites' },
        { id: 'analytics', icon: '📊', label: 'Analytics' },
        { id: 'targets', icon: '🎯', label: 'Targets' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50 pb-24">
            {/* Header with User Greeting - Sticky White */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-md p-4">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center justify-center text-lg font-bold">
                                H
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">Hey, {user.name}!</h1>
                                <p className="text-gray-500 text-sm">Welcome DTQuiz</p>
                            </div>
                        </div>
                        <button className="text-gray-600 text-2xl hover:text-purple-600 rounded-full p-2 transition">
                            🔔
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto px-4 py-6 space-y-6">
                {/* Quiz Coins Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-8 -right-2 w-40 h-40 bg-white/5 rounded-full" />
                    <div className="absolute top-4 right-16 w-10 h-10 bg-white/10 rounded-full" />

                    <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-4">Your Balance</p>

                    <div className="flex items-end gap-3 mb-5">
                        <span className="text-5xl leading-none">🪙</span>
                        <div>
                            <p className="text-5xl font-extrabold leading-none tracking-tight">{user.quizCoins}</p>
                            <p className="text-purple-200 text-sm mt-1 font-medium">Quiz Coins</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/15 rounded-2xl px-4 py-2.5 w-fit">
                        <span className="text-lg">🎯</span>
                        <p className="text-sm font-semibold">Answer correctly to earn more coins!</p>
                    </div>
                </div>

                {/* Quiz Zone Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>⏰</span> Quiz Zone
                    </h2>

                    {/* Quiz Type Grid */}
                    {loadingTypes ? (
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-gray-200 animate-pulse rounded-2xl h-32" />
                            ))}
                        </div>
                    ) : quizTypes.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">No quiz types available yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {quizTypes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className={`${quiz.bgColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105`}
                                    onClick={() => navigate(`/quiz-type/${encodeURIComponent(quiz.title)}`)}
                                >
                                    <div className="text-4xl mb-3">{quiz.icon}</div>
                                    <h3 className="font-bold text-lg">{quiz.title}</h3>
                                    <p className="text-xs opacity-90 mt-1">{quiz.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Exam Zone Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📚</span> Exam Zone
                    </h2>

                    {/* Exam / Category Grid */}
                    {loadingCategories ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-gray-200 animate-pulse rounded-2xl h-24" />
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">No categories available yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {categories.map((cat, idx) => (
                                <div
                                    key={cat._id}
                                    className={`${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105`}
                                    onClick={() => navigate(`/exam/${encodeURIComponent(cat.name)}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        {cat.img ? (
                                            <img src={cat.img} alt={cat.name} className="w-12 h-12 rounded-full object-cover bg-white/20" />
                                        ) : (
                                            <div className="text-4xl">📚</div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg">{cat.name}</h3>
                                            <p className="text-sm opacity-80 mt-1">Explore {cat.name} questions</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Empty Space for Bottom Navigation */}
                <div className="h-4"></div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
                <div className="max-w-md mx-auto px-4 py-3 flex justify-around items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`flex flex-col items-center gap-1 py-3 px-4 rounded-lg transition ${
                                activeNav === item.id
                                    ? 'text-purple-600 bg-purple-50'
                                    : 'text-gray-600 hover:text-purple-600'
                            }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-xs font-semibold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
