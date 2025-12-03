import pool from '../config/database.js';
import { generateAnonymousId, generateAnonymousUsername, generateAnonymousAvatar } from '../utils/anonymous.js';

export async function getOrCreateSession(sessionId) {
    let result = await pool.query(
        'SELECT * FROM sessions WHERE session_id = $1',
        [sessionId]
    );

    if (result.rows.length === 0) {
        // Create new session
        const anonymousId = generateAnonymousId();
        const anonymousUsername = generateAnonymousUsername();
        const anonymousAvatar = generateAnonymousAvatar();
        
        result = await pool.query(
            `INSERT INTO sessions (session_id, anonymous_id, anonymous_username, anonymous_avatar)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [sessionId, anonymousId, anonymousUsername, anonymousAvatar]
        );
    } else {
        // Update last active
        await pool.query(
            'UPDATE sessions SET last_active = CURRENT_TIMESTAMP WHERE session_id = $1',
            [sessionId]
        );
    }

    return result.rows[0];
}

