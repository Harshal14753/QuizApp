import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getQuizQuestions, addCoins } from '../services/UserService'
import { UserDataContext } from '../context/UserContext'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

const PlayQuiz = () => {
    const [searchParams]  = useSearchParams()
    const navigate        = useNavigate()
    const { user, setUser } = React.useContext(UserDataContext)

    const quizType       = searchParams.get('quizType')
    const skillId        = searchParams.get('skill')
    const categoryId     = searchParams.get('category')
    const classId        = searchParams.get('classification')
    const levelId        = searchParams.get('level')

    const [questions,   setQuestions]   = useState([])
    const [current,     setCurrent]     = useState(0)
    const [selected,    setSelected]    = useState(null)
    const [answered,    setAnswered]    = useState(false)
    const [score,       setScore]       = useState(0)
    const [coins,       setCoins]       = useState(0)
    const [showResult,  setShowResult]  = useState(false)
    const [loading,     setLoading]     = useState(true)

    useEffect(() => {
        const fetchQ = async () => {
            try {
                const data = await getQuizQuestions({
                    quizType,
                    skill:          skillId,
                    category:       categoryId,
                    classification: classId,
                    level:          levelId,
                })
                if (data.success) setQuestions(data.questions)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchQ()
    }, [])

    const handleOption = (opt) => {
        if (answered) return
        setSelected(opt)
        setAnswered(true)
        const q = questions[current]
        if (opt === q.answer) {
            setScore((s) => s + 1)
            setCoins((c) => c + (q.coins || 1))
        }
    }

    const handleNext = () => {
        if (current + 1 < questions.length) {
            setCurrent((c) => c + 1)
            setSelected(null)
            setAnswered(false)
        } else {
            // Save earned coins to DB before showing result
            if (coins > 0) {
                addCoins(coins)
                    .then((data) => {
                        if (data.success) {
                            setUser((prev) => ({ ...prev, quizCoins: data.quizCoins }))
                        }
                    })
                    .catch((err) => console.error('Failed to update coins:', err))
            }
            setShowResult(true)
        }
    }

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4 animate-bounce">🎮</div>
                    <p className="text-gray-500 font-medium">Loading questions…</p>
                </div>
            </div>
        )
    }

    /* ── No questions ── */
    if (!loading && questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50 flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="text-5xl mb-4">😕</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Questions Found</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        No questions match your selected filters. Try a different combination.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    /* ── Result screen ── */
    if (showResult) {
        const pct = Math.round((score / questions.length) * 100)
        const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '😊' : '😅'
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-6xl mb-4">{emoji}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">Quiz Complete!</h2>
                    <p className="text-gray-500 mb-6 text-sm">{quizType}</p>

                    <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 space-y-4">
                        <p className="text-6xl font-bold text-purple-600">{pct}%</p>
                        <p className="text-gray-500">{score} / {questions.length} correct</p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-purple-600 h-3 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="flex justify-center gap-2 pt-2">
                            <span className="bg-yellow-100 text-yellow-700 font-bold px-4 py-1.5 rounded-full text-sm">
                                🪙 +{coins} coins earned
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                        >
                            🏠 Home
                        </button>
                        <button
                            onClick={() => {
                                setCurrent(0); setScore(0); setCoins(0)
                                setSelected(null); setAnswered(false); setShowResult(false)
                            }}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:from-purple-700 transition"
                        >
                            🔁 Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    /* ── Quiz screen ── */
    const q        = questions[current]
    const progress = (current / questions.length) * 100

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50 pb-10">

            {/* ── Header ── */}
            <div className="bg-white border-b border-gray-200 shadow-sm p-4">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition font-bold"
                        >
                            ✕
                        </button>
                        <span className="text-sm font-semibold text-gray-600">
                            {current + 1} / {questions.length}
                        </span>
                        <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            🪙 {coins}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-5">

                {/* ── Meta badges ── */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {q.category?.name     && <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-medium">{q.category.name}</span>}
                    {q.skill?.name        && <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">{q.skill.name}</span>}
                    {q.level?.name        && <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">🏆 {q.level.name}</span>}
                    {q.coins              && <span className="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-full font-medium">🪙 {q.coins}</span>}
                </div>

                {/* ── Question card ── */}
                <div className="bg-white rounded-2xl p-6 shadow-md mb-5">
                    {q.image && (
                        <img
                            src={q.image}
                            alt="question"
                            className="w-full rounded-xl mb-4 object-cover max-h-48"
                        />
                    )}
                    <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                        {q.question}
                    </p>
                </div>

                {/* ── Options ── */}
                <div className="space-y-3">
                    {q.options.map((opt, i) => {
                        let style = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-purple-400'
                        if (answered) {
                            if (opt === q.answer)    style = 'bg-green-500 border-green-500 text-white'
                            else if (opt === selected) style = 'bg-red-400 border-red-400 text-white'
                            else                       style = 'bg-white border-2 border-gray-200 text-gray-400'
                        }
                        return (
                            <div
                                key={i}
                                onClick={() => handleOption(opt)}
                                className={`${style} rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all shadow-sm hover:shadow-md select-none`}
                            >
                                <span className="w-7 h-7 shrink-0 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold">
                                    {OPTION_LETTERS[i]}
                                </span>
                                <span className="font-medium leading-snug">{opt}</span>

                                {/* Correct / Wrong icon */}
                                {answered && opt === q.answer && (
                                    <span className="ml-auto text-lg">✅</span>
                                )}
                                {answered && opt === selected && opt !== q.answer && (
                                    <span className="ml-auto text-lg">❌</span>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ── Next button ── */}
                {answered && (
                    <button
                        onClick={handleNext}
                        className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 transition text-base"
                    >
                        {current + 1 < questions.length ? 'Next Question →' : 'See Results 🎉'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default PlayQuiz
