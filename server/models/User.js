import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'The name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'The email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
            default: 'https://via.placeholder.com/150' // Default avatar
        },
        googleId: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        favorites: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Itinerary'
            }
        ]
    },
    {
        timestamps: true
    }
);

export default model('User', userSchema);