import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import ENV from '../lib/env.js'

export const authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
    
    if (!token){
        return res.status(401).json({ message: 'Unauthorized', code: 'NO_TOKEN' });
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized', code: 'USER_NOT_FOUND' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('JWT verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        return res.status(401).json({ message: 'Unauthorized', code: 'INVALID_TOKEN' });
    }
}
