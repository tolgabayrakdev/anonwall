import * as sessionService from '../service/sessionService.js';
import { generateSessionId } from '../utils/anonymous.js';

export async function getSession(req, res) {
    try {
        let sessionId = req.cookies.sessionId || req.headers['x-session-id'];
        
        if (!sessionId) {
            sessionId = generateSessionId();
        }

        const session = await sessionService.getOrCreateSession(sessionId);
        
        // Set cookie
        res.cookie('sessionId', sessionId, {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            httpOnly: true,
            sameSite: 'lax'
        });

        res.json({
            sessionId: session.session_id,
            anonymousId: session.anonymous_id,
            anonymousUsername: session.anonymous_username,
            anonymousAvatar: session.anonymous_avatar
        });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Oturum oluşturulamadı' });
    }
}

