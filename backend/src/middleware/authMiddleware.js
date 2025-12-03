import { verifyToken } from '../service/authService.js';
import { getUserById } from '../service/authService.js';

export async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Token bulunamadı' });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return res.status(403).json({ error: 'Geçersiz token' });
        }

        const user = await getUserById(decoded.userId);
        if (!user) {
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
