import { useNavigate } from 'react-router-dom'

const Landing = () => {
    const navigate = useNavigate()

    const features = [
        {
            id: 1,
            icon: '📚',
            title: 'Multiple Categories',
            description: 'Access quizzes across various subjects and difficulty levels'
        },
        {
            id: 2,
            icon: '📊',
            title: 'Track Progress',
            description: 'Monitor your performance with detailed analytics and statistics'
        },
        {
            id: 3,
            icon: '⚡',
            title: 'Instant Results',
            description: 'Get immediate feedback on your answers with explanations'
        },
        {
            id: 4,
            icon: '🏆',
            title: 'Leaderboard',
            description: 'Compete with others and climb the rankings'
        },
        {
            id: 5,
            icon: '🎓',
            title: 'Expert Content',
            description: 'High-quality questions curated by subject matter experts'
        },
        {
            id: 6,
            icon: '📱',
            title: 'Mobile Friendly',
            description: 'Learn and practice quizzes on the go, anytime, anywhere'
        }
    ]

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg sticky top-0 z-50">
                <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        <h1 className="text-white font-bold text-lg">QuizMaster</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 bg-transparent text-white border-2 border-white rounded-lg text-sm font-semibold hover:bg-white hover:text-purple-600 transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-purple-600 to-purple-700 text-white text-center py-12 px-4">
                <h1 className="text-4xl font-bold mb-3">Welcome to QuizMaster</h1>
                <p className="text-lg opacity-90 mb-6">Test Your Knowledge, Track Your Progress</p>
                <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105"
                >
                    Get Started
                </button>
            </section>

            {/* Features Section */}
            <section className="flex-1 max-w-md mx-auto px-4 py-8 w-full">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose QuizMaster?</h2>

                <div className="space-y-4">
                    {features.map((feature) => (
                        <div key={feature.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600 hover:shadow-lg transition">
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-4 px-4 max-w-md mx-auto w-full">
                <p className="text-sm">© 2026 QuizMaster. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Landing