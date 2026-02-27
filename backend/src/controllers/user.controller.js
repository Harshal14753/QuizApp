import User from '../models/user.model.js'
import Question from '../models/question.model.js'
import BasicItem from '../models/basicItem.model.js'

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        console.log("Registering user:", { name, email, password }) // Debug log
        // Validation
        if (!name || !email || !password ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            })
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            })
        }

        // Hash password
        const hashedPassword = await User.hashPassword(password);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        // Generate token
        const token = user.generateAuthToken()

        // Return user without password
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                quizCoins: user.quizCoins
            }
        })
    } catch (error) {
        console.log(error); 
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            })
        }
        console.log("Login attempt:", { email, password }) // Debug log

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
        console.log("Found user:", user) // Debug log
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Compare password
        const isPasswordMatch = await user.comparePassword(password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Generate token
        const token = user.generateAuthToken()

        // Set cookie
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        // Return user without password
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                quizCoins: user.quizCoins
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        // req.user should be set by auth middleware
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                quizCoins: user.quizCoins,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const logout = async (req, res) => {
    try {
        // Client should remove token from localStorage
        
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getQuizTypes = async (req, res) => {
    try {
        const quizTypes = await Question.distinct('quizType')
        res.status(200).json({
            success: true,
            quizTypes
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await BasicItem.find({ type: 'category' }).select('name img')
        res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getBasicItemsByType = async (req, res) => {
    try {
        const { type } = req.params
        const validTypes = ['category', 'skill', 'classification', 'level', 'avtar']
        if (!validTypes.includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid type' })
        }
        const items = await BasicItem.find({ type }).select('name img')
        res.status(200).json({ success: true, items })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const addCoins = async (req, res) => {
    try {
        const { coins } = req.body
        if (!coins || coins <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid coins value' })
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { quizCoins: coins } },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.status(200).json({ success: true, quizCoins: user.quizCoins })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getQuizQuestions = async (req, res) => {
    try {
        const { quizType, skill, category, classification, level } = req.query
        const filter = {}
        if (quizType)        filter.quizType        = quizType
        if (skill)           filter.skill           = skill
        if (category)        filter.category        = category
        if (classification)  filter.classification  = classification
        if (level)           filter.level           = level
        const questions = await Question.find(filter)
            .populate('category skill classification level', 'name')
        res.status(200).json({ success: true, questions })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
