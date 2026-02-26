import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { getUserProfile } from '../services/UserService'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState('home')

    const {user, setUser} = React.useContext(UserDataContext)


    // Quiz Types/Zones
    const quizTypes = [
        {
            id: 1,
            icon: '✏️',
            title: 'Practice Quiz',
            bgColor: 'bg-red-400',
            description: 'Practice with unlimited attempts'
        },
        {
            id: 2,
            icon: '🧠',
            title: 'Normal Quiz',
            bgColor: 'bg-amber-400',
            description: 'Test your skills'
        },
        {
            id: 3,
            icon: '🎧',
            title: 'Audio Quiz',
            bgColor: 'bg-teal-500',
            description: 'Learn by listening'
        },
        {
            id: 4,
            icon: '🎥',
            title: 'Video Quiz',
            bgColor: 'bg-indigo-600',
            description: 'Learn through videos'
        }
    ]

    // Exam Types
    const examTypes = [
        {
            id: 1,
            icon: '📜',
            title: 'History Exam',
            bgColor: 'bg-orange-500',
            description: 'Comprehensive history exam'
        },
        {
            id: 2,
            icon: '🔬',
            title: 'Science Exam',
            bgColor: 'bg-green-500',
            description: 'Science examination'
        },
        {
            id: 3,
            icon: '🔢',
            title: 'Math Exam',
            bgColor: 'bg-blue-500',
            description: 'Mathematics examination'
        }
    ]

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
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">🪙</span>
                            <div>
                                <p className="text-purple-100 text-sm font-semibold">Quiz Coins</p>
                                <p className="text-3xl font-bold">{user.quizCoins}</p>
                            </div>
                        </div>
                        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition">
                            Earn
                        </button>
                    </div>
                </div>

                {/* Quiz Zone Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>⏰</span> Quiz Zone
                    </h2>

                    {/* Quiz Type Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {quizTypes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className={`${quiz.bgColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105`}
                                onClick={() => navigate(`/quiz-type/${quiz.id}`)}
                            >
                                <div className="text-4xl mb-3">{quiz.icon}</div>
                                <h3 className="font-bold text-lg">{quiz.title}</h3>
                                <p className="text-xs opacity-90 mt-1">{quiz.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Exam Zone Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📚</span> Exam Zone
                    </h2>

                    {/* Exam Type Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {examTypes.map((exam) => (
                            <div
                                key={exam.id}
                                className={`${exam.bgColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105`}
                                onClick={() => navigate(`/exam/${exam.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{exam.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg">{exam.title}</h3>
                                        <p className="text-sm opacity-90 mt-1">{exam.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
