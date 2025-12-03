import * as postService from '../service/postService.js';
import * as sessionService from '../service/sessionService.js';
import { generateFingerprint } from '../utils/fingerprint.js';

export async function createPost(req, res) {
    try {
        const { content, categoryId } = req.body;
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'İçerik boş olamaz' });
        }

        if (content.length > 500) {
            return res.status(400).json({ error: 'İçerik 500 karakterden uzun olamaz' });
        }

        // User must be authenticated (enforced by authenticateToken middleware)
        if (!req.user) {
            return res.status(401).json({ error: 'Paylaşım yapmak için giriş yapmalısınız' });
        }

        // Check if phone is verified
        if (!req.user.phone_verified) {
            return res.status(403).json({ error: 'Paylaşım yapmak için telefon numaranızı doğrulamanız gerekiyor' });
        }

        const anonymousId = req.user.anonymous_id;
        const anonymousUsername = req.user.anonymous_username;
        const anonymousAvatar = req.user.anonymous_avatar;
        
        const post = await postService.createPost(
            content.trim(),
            categoryId,
            anonymousId,
            anonymousUsername,
            anonymousAvatar
        );

        res.status(201).json(post);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: error.message || 'Post oluşturulamadı' });
    }
}

export async function getPosts(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;

        const posts = await postService.getPosts(limit, offset, categoryId);
        
        // Get like status for each post if session exists
        const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
        if (sessionId) {
            const fingerprint = generateFingerprint(req);
            for (const post of posts) {
                post.is_liked = await postService.checkLikeStatus(post.id, fingerprint);
            }
        }

        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Postlar yüklenemedi' });
    }
}

export async function getPost(req, res) {
    try {
        const postId = parseInt(req.params.id);
        const post = await postService.getPostById(postId);
        
        if (!post) {
            return res.status(404).json({ error: 'Post bulunamadı' });
        }

        const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
        if (sessionId) {
            const fingerprint = generateFingerprint(req);
            post.is_liked = await postService.checkLikeStatus(post.id, fingerprint);
        }

        res.json(post);
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ error: 'Post yüklenemedi' });
    }
}

export async function getMyPosts(req, res) {
    try {
        // User must be authenticated (enforced by authenticateToken middleware)
        if (!req.user) {
            return res.status(401).json({ error: 'Giriş yapmalısınız' });
        }

        const anonymousId = req.user.anonymous_id;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const posts = await postService.getPostsByAnonymousId(anonymousId, limit, offset);
        
        const fingerprint = generateFingerprint(req);
        for (const post of posts) {
            post.is_liked = await postService.checkLikeStatus(post.id, fingerprint);
        }

        res.json(posts);
    } catch (error) {
        console.error('Get my posts error:', error);
        res.status(500).json({ error: 'Postlar yüklenemedi' });
    }
}

export async function getTrending(req, res) {
    try {
        const period = req.query.period || '24h'; // '24h' or 'weekly'
        const limit = parseInt(req.query.limit) || 20;

        const posts = await postService.getTrendingPosts(period, limit);
        
        const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
        if (sessionId) {
            const fingerprint = generateFingerprint(req);
            for (const post of posts) {
                post.is_liked = await postService.checkLikeStatus(post.id, fingerprint);
            }
        }

        res.json(posts);
    } catch (error) {
        console.error('Get trending error:', error);
        res.status(500).json({ error: 'Trend postlar yüklenemedi' });
    }
}

export async function toggleLike(req, res) {
    try {
        const postId = parseInt(req.params.id);
        const fingerprint = generateFingerprint(req);

        const result = await postService.likePost(postId, fingerprint);
        const post = await postService.getPostById(postId);

        res.json({ ...result, likes_count: post.likes_count });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ error: 'Beğeni işlemi başarısız' });
    }
}

export async function reportPost(req, res) {
    try {
        const postId = parseInt(req.params.id);
        const { reason } = req.body;
        const fingerprint = generateFingerprint(req);

        await postService.reportPost(postId, fingerprint, reason);
        res.json({ success: true, message: 'Rapor gönderildi' });
    } catch (error) {
        console.error('Report post error:', error);
        res.status(500).json({ error: 'Rapor gönderilemedi' });
    }
}
