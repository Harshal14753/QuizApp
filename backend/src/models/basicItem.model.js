import mongoose from "mongoose";

const basicItemSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Please provide a type'],
        enum: ['category', 'skill', 'classification', "level", "avtar"]
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [20, 'Name cannot exceed 50 characters']
    },
    img: {
        type: String,
        match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/, 'Please provide a valid image URL']
    }
}, {
    timestamps: true
});

const BasicItem = mongoose.model('BasicItem', basicItemSchema);

export default BasicItem;