import jwt from 'jsonwebtoken'
import ENV from '../lib/env.js'
import User from '../models/user.model.js';

const authAdmin = async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token){
        return res.status(401).json({ message: 'Unauthorized', code: 'NO_TOKEN' });
    }

    try {
        const decode = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decode._id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden', code: 'NOT_ADMIN' });
        }
        res.user = user;
        next();
    } catch (error) {
        console.log('JWT verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        return res.status(401).json({ message: 'Unauthorized', code: 'INVALID_TOKEN' });
    }

}

export default authAdmin