import * as authService from '../service/authService.js';

export async function register(req, res) {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ error: 'Telefon numarası ve şifre gereklidir' });
        }

        const result = await authService.registerUser(phone, password);
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ error: error.message || 'Kayıt başarısız' });
    }
}

export async function verifyPhone(req, res) {
    try {
        const { phone, code } = req.body;

        if (!phone || !code) {
            return res.status(400).json({ error: 'Telefon numarası ve doğrulama kodu gereklidir' });
        }

        const result = await authService.verifyPhone(phone, code);
        
        res.json(result);
    } catch (error) {
        console.error('Verify phone error:', error);
        res.status(400).json({ error: error.message || 'Doğrulama başarısız' });
    }
}

export async function resendCode(req, res) {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Telefon numarası gereklidir' });
        }

        const result = await authService.resendVerificationCode(phone);
        
        res.json(result);
    } catch (error) {
        console.error('Resend code error:', error);
        res.status(400).json({ error: error.message || 'Kod gönderilemedi' });
    }
}

export async function login(req, res) {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ error: 'Telefon numarası ve şifre gereklidir' });
        }

        const result = await authService.loginUser(phone, password);
        
        res.json(result);
    } catch (error) {
        console.error('Login error:', error);
        
        // If verification is required, return special response
        if (error.message === 'VERIFICATION_REQUIRED') {
            return res.status(403).json({ 
                error: 'Telefon numaranızı doğrulamanız gerekiyor',
                requiresVerification: true,
                phone: error.phone
            });
        }
        
        res.status(401).json({ error: error.message || 'Giriş başarısız' });
    }
}

export async function getMe(req, res) {
    try {
        // req.user is set by authMiddleware
        res.json({
            user: {
                id: req.user.id,
                phone: req.user.phone,
                anonymousId: req.user.anonymous_id,
                anonymousUsername: req.user.anonymous_username,
                anonymousAvatar: req.user.anonymous_avatar,
                phoneVerified: req.user.phone_verified || false,
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Kullanıcı bilgileri alınamadı' });
    }
}

