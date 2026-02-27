import User from '../models/user.model.js';
import Question from '../models/question.model.js';
import BasicItem from '../models/basicItem.model.js';

const QUIZ_TYPE_LABELS = {
    'practice-quiz': 'Practice Quiz',
    'normal-quiz':   'Normal Quiz',
    'audio-quiz':    'Audio Quiz',
    'video-quiz':    'Video Quiz',
    'true-false':    'True / False',
    'daily-quiz':    'Daily Quiz',
    'fear-factor':   'Fear Factor',
}

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password'); // ✅ password has select:false in schema
        console.log('Admin user found: ', user?.email, ' Role: ', user?.role);
        if (!user || user.role !== 'admin') {
            console.log('Admin user not found or role mismatch ', user?.role);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        const isPasswordMatch = await user.comparePassword(password); // ✅ await added
        console.log('Password match: ', isPasswordMatch);   
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = user.generateAuthToken();
        res.cookie('token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 days
        });
        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');    
        res.status(200).json({
            success: true,
            users
        });
    }  catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching users'
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user){
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user'
        });
    }
}


export const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user){
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting user'
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select('-password');
        if (!user){
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating user'
        });
    }
}

// Admin

export const getAdminProfile = async (req, res) => {
    try {
        const user = await User.findById(res.user._id).select('-password');
        
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
                createdAt: user.createdAt
            }
        });
    } catch (error){

    }

}

export const changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(res.user._id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        const hashPassword = await User.hashPassword(newPassword)

        user.password = hashPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while changing password'
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Admin logged out successfully'
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during logout'
        });
    }
}

// Question

export const getAllQuestion = async (req, res) => {
    try {
        const quizType = QUIZ_TYPE_LABELS[req.params.quizType]
        if (!quizType) {
            return res.status(400).json({
                success: false,
                message: `Invalid quiz type: ${req.params.quizType}`
            })
        }
        const questions = await Question.find({ quizType }).populate('category skill classification level', 'name');

        res.status(200).json({
            success: true,
            questions
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching questions'
        });
    }
}

export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('category skill classification level', 'name');
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        res.status(200).json({
            success: true,
            question
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching question'
        });
    }
}

export const createQuestion = async (req, res) => {
    try {
        const quizType = QUIZ_TYPE_LABELS[req.params.quizType];
        if (!quizType) {
            return res.status(400).json({
                success: false,
                message: `Invalid quiz type: ${req.params.quizType}`
            });
        }
        const questionData = req.body;
        const question = new Question({ ...questionData, quizType });
        await question.save();
        res.status(201).json({
            success: true,
            question
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating question'
        });
    }
}

export const updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        res.status(200).json({
            success: true,
            question
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating question'
        });
    }
}

export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        return res.status(200).json({
            success: true,
            "message": 'Question deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting question'
        });
    }
}

export const getBasicItemsByType = async (req, res) => {
    try {
        const basicItemType = req.params.basicItem;
        const items = await BasicItem.find({ type: basicItemType });
        if (!items) {
            return res.status(404).json({
                success: false,
                message: `${basicItemType} not found`
            });
        }
        res.status(200).json({
            success: true,
            items
        });
    } catch (error) {
        console.error(`Error fetching ${req.params.basicItem}:`, error);
        res.status(500).json({
            success: false,
            message: `An error occurred while fetching ${req.params.basicItem}`
        });
    }
}

export const getBasicItemById = async (req, res) => {
    try {
        const basicItem = await BasicItem.findById(req.params.id);
        if (!basicItem) {
            return res.status(404).json({
                success: false,
                message: 'Basic item not found'
            });
        }
        res.status(200).json({
            success: true,
            basicItem
        });
    } catch (error) {
        console.error('Error fetching basic item:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching basic item'
        });
    }
}

export const createBasicItem = async (req, res) => {
    try {
        const basicItemType = req.params.basicItem;
        if (!basicItemType) {
            return res.status(400).json({
                success: false,
                message: 'Basic item type is required in URL'
            });
        }
        const basicItemData = req.body;
        const basicItem = new BasicItem({ ...basicItemData, type: basicItemType });
        if (!basicItem) {
            res.status(400).json({
                success: false,
                message: "Invalid data for creating basic item"
            })
        }
        await basicItem.save();
        res.status(201).json({
            success: true,
            basicItem
        })
    } catch (error) {
        console.error('Error creating basic item:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating basic item'
        });
    }
}

export const updateBasicItem = async (req, res) => {
    try {
        const basicItem = await BasicItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!basicItem) {
            return res.status(404).json({
                success: false,
                message: 'Basic item not found'
            });
        }
        res.status(200).json({
            success: true,
            basicItem
        });
    } catch (error) {
        console.error('Error updating basic item:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating basic item'
        });
    }
}

export const deleteBasicItem = async (req, res) => {
    try {
        const basicItem = await BasicItem.findByIdAndDelete(req.params.id);
        if (!basicItem) {
            return res.status(404).json({
                success: false,
                message: 'Basic item not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Basic item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting basic item:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting basic item'
        });
    }
}