// Generate fingerprint from IP and User-Agent for like tracking
import crypto from 'crypto';

export function generateFingerprint(req) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    const combined = `${ip}_${userAgent}`;
    
    return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 32);
}

