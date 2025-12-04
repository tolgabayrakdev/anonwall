import { verifyToken } from '../service/authService.js';
import { getUserById } from '../service/authService.js';

export async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            console.log('No authorization header');
            return res.status(401).json({ error: 'Token bulunamadı' });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            console.log('No token in authorization header');
            return res.status(401).json({ error: 'Token bulunamadı' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            console.log('Token verification failed - invalid token');
            return res.status(403).json({ error: 'Geçersiz token' });
        }

        if (!decoded.userId) {
            console.log('Token decoded but no userId found');
            return res.status(403).json({ error: 'Geçersiz token formatı' });
        }

        const user = await getUserById(decoded.userId);
        if (!user) {
            console.log(`User not found for userId: ${decoded.userId}`);
            return res.status(403).json({ error: 'Kullanıcı bulunamadı' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
}

export async function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            try {
                const user = await getUserById(decoded.userId);
                if (user) {
                    req.user = user;
                }
            } catch (error) {
                // Continue without user
            }
        }
    }
    next();
}
