import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    quizType: {
        type: String,
        required: [true, 'Quiz type is required'],
        enum: ['Practice Quiz', 'Normal Quiz', 'Audio Quiz', 'Video Quiz', 'True / False', 'Daily Quiz', 'Fear Factor'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BasicItem',
        required: [true, 'Category is required'],
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BasicItem',
        required: [true, 'Skill is required'],
    },
    classification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BasicItem',
        required: [true, 'Classification is required'],
    },
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BasicItem',
        required: [true, 'Level is required'],
    },
    image: {
        type: String,
        default: null,
    },
    question: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true,
    },
    options: {
        type: [String],
        required: [true, 'Options are required'],
        validate: {
            validator: (v) => v.length >= 2 && v.length <= 5,
            message: 'Options must have between 2 and 5 items',
        },
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
    },
    coins: {
        type: Number,
        required: [true, 'Coins are required'],
        min: [0, 'Coins cannot be negative'],
        default: 10,
    },
    status: {
        type: String,
        enum: ['show', 'hidden'],
        default: 'show',
    },
}, {
    timestamps: true,
});

// ── Index for fast filtering ──────────────────────────────────────────────────
questionSchema.index({ quizType: 1, category: 1, skill: 1, classification: 1, level: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;