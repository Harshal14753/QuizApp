import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../lib/env.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't return password by default when querying
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    quizCoins: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
    return token;
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema);

export default User;
