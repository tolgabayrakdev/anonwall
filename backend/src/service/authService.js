import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAnonymousId, generateAnonymousUsername, generateAnonymousAvatar } from '../utils/anonymous.js';
import { sendSms } from '../utils/send-sms.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
}

export async function registerUser(phone, password) {
    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        throw new Error('Geçersiz telefon numarası formatı');
    }

    // Check if user already exists
    const existingUser = await pool.query(
        'SELECT id, phone_verified FROM users WHERE phone = $1',
        [cleanPhone]
    );

    if (existingUser.rows.length > 0) {
        if (existingUser.rows[0].phone_verified) {
            throw new Error('Bu telefon numarası zaten kayıtlı');
        } else {
            // User exists but not verified, update password and resend code
            const verificationCode = generateVerificationCode();
            const passwordHash = await bcrypt.hash(password, 10);
            
            await pool.query(
                `UPDATE users 
                 SET password_hash = $1, verification_code = $2, verification_code_expires_at = NOW() + INTERVAL '10 minutes'
                 WHERE phone = $3`,
                [passwordHash, verificationCode, cleanPhone]
            );

            // Send SMS
            await sendSms({
                msg: `AnonWall doğrulama kodunuz: ${verificationCode}`,
                no: cleanPhone
            });

            return { 
                message: 'Doğrulama kodu gönderildi',
                phone: cleanPhone,
                requiresVerification: true
            };
        }
    }

    // Validate password
    if (!password || password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate anonymous identity
    const anonymousId = generateAnonymousId();
    const anonymousUsername = generateAnonymousUsername();
    const anonymousAvatar = generateAnonymousAvatar();

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create user (not verified yet)
    const result = await pool.query(
        `INSERT INTO users (phone, password_hash, anonymous_id, anonymous_username, anonymous_avatar, verification_code, verification_code_expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '10 minutes')
         RETURNING id, phone, anonymous_id, anonymous_username, anonymous_avatar, created_at`,
        [cleanPhone, passwordHash, anonymousId, anonymousUsername, anonymousAvatar, verificationCode]
    );

    const user = result.rows[0];

    // Send SMS with verification code
    try {
        await sendSms({
            msg: `AnonWall doğrulama kodunuz: ${verificationCode}`,
            no: cleanPhone
        });
    } catch (error) {
        console.error('SMS gönderme hatası:', error);
        // Continue even if SMS fails (for development)
    }

    return {
        message: 'Doğrulama kodu gönderildi',
        phone: user.phone,
        requiresVerification: true
    };
}

export async function verifyPhone(phone, code) {
    const result = await pool.query(
        `SELECT id, verification_code, verification_code_expires_at, phone_verified 
         FROM users WHERE phone = $1`,
        [phone]
    );

    if (result.rows.length === 0) {
        throw new Error('Kullanıcı bulunamadı');
    }

    const user = result.rows[0];

    if (user.phone_verified) {
        throw new Error('Telefon numarası zaten doğrulanmış');
    }

    if (!user.verification_code) {
        throw new Error('Doğrulama kodu bulunamadı');
    }

    // Check expiration - use database time comparison to avoid timezone issues
    const expirationCheck = await pool.query(
        `SELECT NOW() > verification_code_expires_at as is_expired 
         FROM users WHERE id = $1`,
        [user.id]
    );

    if (expirationCheck.rows[0]?.is_expired) {
        throw new Error('Doğrulama kodu süresi dolmuş');
    }

    if (user.verification_code !== code) {
        throw new Error('Doğrulama kodu hatalı');
    }

    // Verify user
    await pool.query(
        `UPDATE users 
         SET phone_verified = TRUE, verification_code = NULL, verification_code_expires_at = NULL
         WHERE id = $1`,
        [user.id]
    );

    // Get updated user
    const updatedUser = await pool.query(
        'SELECT id, phone, anonymous_id, anonymous_username, anonymous_avatar FROM users WHERE id = $1',
        [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
        { userId: updatedUser.rows[0].id, phone: updatedUser.rows[0].phone },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        user: {
            id: updatedUser.rows[0].id,
            phone: updatedUser.rows[0].phone,
            anonymousId: updatedUser.rows[0].anonymous_id,
            anonymousUsername: updatedUser.rows[0].anonymous_username,
            anonymousAvatar: updatedUser.rows[0].anonymous_avatar,
            phoneVerified: true,
        },
        token
    };
}

export async function resendVerificationCode(phone) {
    const result = await pool.query(
        'SELECT id, phone_verified FROM users WHERE phone = $1',
        [phone]
    );

    if (result.rows.length === 0) {
        throw new Error('Kullanıcı bulunamadı');
    }

    const user = result.rows[0];

    if (user.phone_verified) {
        throw new Error('Telefon numarası zaten doğrulanmış');
    }

    const verificationCode = generateVerificationCode();

    await pool.query(
        `UPDATE users 
         SET verification_code = $1, verification_code_expires_at = NOW() + INTERVAL '10 minutes'
         WHERE phone = $2`,
        [verificationCode, phone]
    );

    // Send SMS
    await sendSms({
        msg: `AnonWall doğrulama kodunuz: ${verificationCode}`,
        no: phone
    });

    return { message: 'Doğrulama kodu tekrar gönderildi' };
}

export async function loginUser(phone, password) {
    // Find user
    const cleanPhone = phone.replace(/\s+/g, '');
    const result = await pool.query(
        'SELECT * FROM users WHERE phone = $1',
        [cleanPhone]
    );

    if (result.rows.length === 0) {
        throw new Error('Telefon numarası veya şifre hatalı');
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
        throw new Error('Telefon numarası veya şifre hatalı');
    }

    // Check if phone is verified - if not, send verification code and return special response
    if (!user.phone_verified) {
        // Generate new verification code
        const verificationCode = generateVerificationCode();
        
        await pool.query(
            `UPDATE users 
             SET verification_code = $1, verification_code_expires_at = NOW() + INTERVAL '10 minutes'
             WHERE id = $2`,
            [verificationCode, user.id]
        );

        // Send SMS
        try {
            await sendSms({
                msg: `AnonWall doğrulama kodunuz: ${verificationCode}`,
                no: user.phone
            });
        } catch (error) {
            console.error('SMS gönderme hatası:', error);
            // Continue even if SMS fails (for development)
        }

        // Return special response indicating verification needed
        const error = new Error('VERIFICATION_REQUIRED');
        error.phone = user.phone;
        throw error;
    }

    // Update last login
    await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, phone: user.phone },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        user: {
            id: user.id,
            phone: user.phone,
            anonymousId: user.anonymous_id,
            anonymousUsername: user.anonymous_username,
            anonymousAvatar: user.anonymous_avatar,
            phoneVerified: user.phone_verified,
        },
        token
    };
}

export async function getUserById(userId) {
    const result = await pool.query(
        'SELECT id, phone, anonymous_id, anonymous_username, anonymous_avatar, phone_verified, created_at FROM users WHERE id = $1',
        [userId]
    );
    return result.rows[0];
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

