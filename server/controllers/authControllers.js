import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import axios from 'axios';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "All the fields are required"
            })
        }
    
        const validateUser = await User.findOne({ email: email});
        if (validateUser) {
            return res.status(409).json({ error: "The user already exist"}) 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            password: hashedPassword
        };

        const newUser = new User(userData);
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

            res.status(201).json({
                token,
                user: {
                    _id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    avatar: savedUser.avatar,
                    role: savedUser.role
                }
            });

    } catch (error) {
        res.status(400).json({ message: 'Error to save the user', error: error.message})
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;        
        if (!email || !password) {
            return res.status(400).json({
                error: 'All the fields are required'
            })
        }

        const user = await User.findOne({ email }); 

        if (!user) {
           return res.status(404).json({
                error: 'User not found'
           }) 
        }

        if (user.googleId || !user.password) {
           return res.status(400).json({
                error: 'Please login with google'
           }) 
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
           return res.status(400).json({
                error: 'Invalid Credentials'
           }) 
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        ) 

        return res.status(200).json({
            message: 'Login succesful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error'})
    }

} 

export const googleLogin = async (req,res) => {
    try {
        const { token } = req.body;

        if (!token) {
           return res.status(400).json({ error: 'Google token required'}) 
        }

        const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { email, name, picture, sub } = googleResponse.data;

        if (!email) {
           return res.status(400).json({ error: 'Failed to retrieve email from Google'}) 
        }

        let user = await User.findOne({ email })
        let targetUser;

        if (!user) {
           const userData = {
                name: name,
                email: email,
                avatar: picture,
                googleId: sub
           }; 

           const newUser = new User(userData);
           targetUser = await newUser.save();
        } else {
            if (!user.googleId) {
                user.googleId = sub;

                if (picture && !user.avatar) {
                    user.avatar = picture;
                }

                await user.save();
            }
            targetUser = user;
        }

        const jwtToken = jwt.sign(
            {
                id: targetUser._id,
                role: targetUser.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login succesful',
            token: jwtToken,
            user: {
                _id: targetUser._id,
                name: targetUser.name,
                email: targetUser.email,
                avatar: targetUser.avatar,
                role: targetUser.role
            }
        });

    } catch (error) {
        console.error('Google auth error: ', error.response?.data || error.message);
        return res.status(401).json({ error: 'Invalid Google token or authorization failed'})
    }
}

export const getMe = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findOne({ _id: id }).select('-password'); 

        if (!user) {
           return res.status(404).json({
                error: 'User not found'
           }) 
        }

        return res.status(200).json({
            user: user
        })

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error'})
    }
} 

export const updateProfile = async (req, res) => {
    try {
        const id = req.user.id;

        const { name, avatar, bio } = req.body;

        const updateUser = await User.findByIdAndUpdate(
            id,
            { name, avatar, bio },
            { new: true }
        ).select('-password');

        if (!updateUser) {
            return res.status(404).json({ error: 'User not found'}) 
        }

        return res.status(200).json(updateUser);
        
    } catch (error) {
        return res.status(500).json({ error: 'Error to update the user'})
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS 
            }
        });

        if (!email) {
           return res.status(400).json({ error: 'Email is required'}) 
        }

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (!validEmail.test(email)) {
           return res.status(400).json({ error: 'Please enter a valid email'}) 
        }

        const user = await User.findOne({ email: email })

        if (!user) {
           return res.status(200).json({ message: "If the email address exists, you'll receive a link"}) 
        }
        
        if (user.googleId && !user.password) {
           return res.status(200).json({ message: "If the email address exists, you'll receive a link"}) 
        }

        const token = jwt.sign({ id: user._id, email: email}, process.env.JWT_SECRET, { expiresIn: '1h' })  

        const recoveryUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`

        const mailOptions = {
            from: `Adventure Path <${process.env.GMAIL_USER_ALIAS}>`,
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset your password</h2>
                    <p>You have requested to change your password</p>
                    <p>Click the button below to continue. This link will expire in 1 hour:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${recoveryUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                            Reset my password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 12px;">If you did not request this change, you can safely ignore this email.</p>
                </div>
            ` 
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "If the email address exists, you'll receive a link" }) 

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error'})
    }

}

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body; 

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
           return res.status(404).json({ error: 'User not found' }) 
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        user.password = hashedNewPassword;

        await user.save();

        return res.status(200).json({ message: 'Password reset successful' })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
           return res.status(401).json({ error: 'The link has expired, please request a new one' }) 
        }
        if (error.name === 'JsonWebTokenError') {
           return res.status(401).json({ error: 'Invalid token'}) 
        }
        return res.status(500).json({ error: 'Internal server error'});
    }
}