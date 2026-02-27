import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBasicItemsByType } from '../services/UserService'

const STEP_CONFIG = [
    { key: 'category',       type: 'category',       label: 'Select Category',       icon: '📚' },
    { key: 'skill',          type: 'skill',          label: 'Select Skill',          icon: '🎯' },
    { key: 'classification', type: 'classification', label: 'Select Classification', icon: '🗂️' },
    { key: 'level',          type: 'level',          label: 'Select Level',          icon: '🏆' },
]

const ITEM_COLORS = [
    'bg-indigo-400', 'bg-orange-400', 'bg-teal-400', 'bg-pink-400',
    'bg-cyan-500',   'bg-amber-400',  'bg-rose-400', 'bg-violet-400',
]

const QuizPlay = () => {
    const { quizType } = useParams()
    const navigate = useNavigate()

    const [step, setStep]       = useState(0)
    const [items, setItems]     = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState({
        skill: null, category: null, classification: null, level: null,
    })
    const [showPopup, setShowPopup] = useState(false)

    const fetchItems = async (type) => {
        setLoading(true)
        setItems([])
        try {
            const data = await getBasicItemsByType(type)
            if (data.success) setItems(data.items)
        } catch (e) {
            console.error('Failed to fetch items:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchItems(STEP_CONFIG[0].type)
    }, [])

    const handleSelect = (item) => {
        const key = STEP_CONFIG[step].key
        const newSelected = { ...selected, [key]: item }
        setSelected(newSelected)
        if (step < STEP_CONFIG.length - 1) {
            setStep(step + 1)
            fetchItems(STEP_CONFIG[step + 1].type)
        } else {
            setShowPopup(true)
        }
    }

    const handleBack = () => {
        if (showPopup) { setShowPopup(false); return }
        if (step === 0) { navigate(-1); return }
        const prevKey = STEP_CONFIG[step].key
        setSelected({ ...selected, [prevKey]: null })
        setStep(step - 1)
        fetchItems(STEP_CONFIG[step - 1].type)
    }

    const handlePlayNow = () => {
        const params = new URLSearchParams({
            quizType:       decodeURIComponent(quizType),
            skill:          selected.skill._id,
            category:       selected.category._id,
            classification: selected.classification._id,
            level:          selected.level._id,
        })
        navigate(`/play-quiz?${params.toString()}`)
    }

    const cfg = STEP_CONFIG[step]

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50">

            {/* ── Header ── */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm p-4">
                <div className="max-w-md mx-auto flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition text-lg font-bold"
                    >
                        ←
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-gray-800 text-base truncate">
                            {decodeURIComponent(quizType)}
                        </h1>
                        <p className="text-xs text-purple-600 font-medium">{cfg.label}</p>
                    </div>
                    {/* Step dots */}
                    <div className="flex gap-1.5">
                        {STEP_CONFIG.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    i < step  ? 'w-5 bg-purple-600' :
                                    i === step ? 'w-5 bg-purple-400' :
                                    'w-2 bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Breadcrumb chips ── */}
            {step > 0 && (
                <div className="max-w-md mx-auto px-4 pt-4 flex flex-wrap gap-2">
                    {STEP_CONFIG.slice(0, step).map((s) =>
                        selected[s.key] ? (
                            <span key={s.key} className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                                {s.icon} {selected[s.key].name}
                            </span>
                        ) : null
                    )}
                </div>
            )}

            {/* ── Section title ── */}
            <div className="max-w-md mx-auto px-4 pt-6 pb-3">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span>{cfg.icon}</span> {cfg.label}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Step {step + 1} of {STEP_CONFIG.length}
                </p>
            </div>

            {/* ── Item grid ── */}
            <div className="max-w-md mx-auto px-4 pb-24">
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-gray-200 animate-pulse rounded-2xl h-28" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">😕</div>
                        <p className="text-gray-500">No {cfg.key}s available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item, idx) => (
                            <div
                                key={item._id}
                                onClick={() => handleSelect(item)}
                                className={`${ITEM_COLORS[idx % ITEM_COLORS.length]} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105 active:scale-95`}
                            >
                                {item.img ? (
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-full mb-3 object-cover bg-white/20"
                                    />
                                ) : (
                                    <div className="text-3xl mb-3">{cfg.icon}</div>
                                )}
                                <h3 className="font-bold text-base leading-tight">{item.name}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Play Now bottom-sheet popup ── */}
            {showPopup && selected.level && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowPopup(false)}
                    />
                    {/* Sheet */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 max-w-md mx-auto">
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

                        <div className="text-center mb-5">
                            <div className="text-5xl mb-2">🏆</div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {selected.level.name}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Are you sure you want to start?</p>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2.5">
                            {[
                                { label: 'Quiz Type',       value: decodeURIComponent(quizType), icon: '🎮' },
                                { label: 'Skill',           value: selected.skill?.name,          icon: '🎯' },
                                { label: 'Category',        value: selected.category?.name,       icon: '📚' },
                                { label: 'Classification',  value: selected.classification?.name, icon: '🗂️' },
                                { label: 'Level',           value: selected.level?.name,          icon: '🏆' },
                            ].map((row) => (
                                <div key={row.label} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        {row.icon} {row.label}
                                    </span>
                                    <span className="font-semibold text-gray-800">{row.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePlayNow}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:from-purple-700 hover:to-purple-800 transition shadow-lg"
                            >
                                🎮 Play Now
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default QuizPlay
