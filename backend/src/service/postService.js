import pool from '../config/database.js';
import { containsProfanity } from '../utils/profanity.js';

export async function createPost(content, categoryId, anonymousId, anonymousUsername, anonymousAvatar) {
    // Check profanity
    if (containsProfanity(content)) {
        throw new Error('İçerik uygun değil');
    }

    const result = await pool.query(
        `INSERT INTO posts (content, category_id, anonymous_id, anonymous_username, anonymous_avatar)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [content, categoryId || null, anonymousId, anonymousUsername, anonymousAvatar]
    );

    const post = result.rows[0];
    
    // Get category info if category_id exists
    if (post.category_id) {
        const categoryResult = await pool.query(
            'SELECT name, slug, color FROM categories WHERE id = $1',
            [post.category_id]
        );
        if (categoryResult.rows.length > 0) {
            post.category_name = categoryResult.rows[0].name;
            post.category_slug = categoryResult.rows[0].slug;
            post.category_color = categoryResult.rows[0].color;
        }
    }

    return post;
}

export async function getPosts(limit = 20, offset = 0, categoryId = null) {
    let query = `
        SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_hidden = FALSE
    `;
    
    const params = [];
    
    if (categoryId) {
        query += ` AND p.category_id = $${params.length + 1}`;
        params.push(categoryId);
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    return result.rows;
}

export async function getPostById(postId) {
    const result = await pool.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
         FROM posts p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = $1 AND p.is_hidden = FALSE`,
        [postId]
    );
    return result.rows[0];
}

export async function getPostsByAnonymousId(anonymousId, limit = 20, offset = 0) {
    const result = await pool.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
         FROM posts p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.anonymous_id = $1 AND p.is_hidden = FALSE
         ORDER BY p.created_at DESC
         LIMIT $2 OFFSET $3`,
        [anonymousId, limit, offset]
    );
    return result.rows;
}

export async function getTrendingPosts(period = '24h', limit = 20) {
    let hours = 24;
    if (period === 'weekly') {
        hours = 168; // 7 days * 24 hours
    }
    
    // Use parameterized query with interval
    const result = await pool.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
         FROM posts p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.is_hidden = FALSE AND p.created_at >= NOW() - ($1 || ' hours')::INTERVAL
         ORDER BY p.likes_count DESC, p.created_at DESC
         LIMIT $2`,
        [hours.toString(), limit]
    );
    return result.rows;
}

export async function likePost(postId, fingerprint) {
    // Check if already liked
    const existingLike = await pool.query(
        'SELECT id FROM likes WHERE post_id = $1 AND fingerprint = $2',
        [postId, fingerprint]
    );

    if (existingLike.rows.length > 0) {
        // Unlike
        await pool.query(
            'DELETE FROM likes WHERE post_id = $1 AND fingerprint = $2',
            [postId, fingerprint]
        );
        await pool.query(
            'UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1',
            [postId]
        );
        return { liked: false };
    } else {
        // Like
        await pool.query(
            'INSERT INTO likes (post_id, fingerprint) VALUES ($1, $2)',
            [postId, fingerprint]
        );
        await pool.query(
            'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
            [postId]
        );
        return { liked: true };
    }
}

export async function checkLikeStatus(postId, fingerprint) {
    const result = await pool.query(
        'SELECT id FROM likes WHERE post_id = $1 AND fingerprint = $2',
        [postId, fingerprint]
    );
    return result.rows.length > 0;
}

export async function reportPost(postId, fingerprint, reason) {
    // Check if already reported
    const existingReport = await pool.query(
        'SELECT id FROM reports WHERE post_id = $1 AND fingerprint = $2',
        [postId, fingerprint]
    );

    if (existingReport.rows.length === 0) {
        await pool.query(
            'INSERT INTO reports (post_id, fingerprint, reason) VALUES ($1, $2, $3)',
            [postId, fingerprint, reason || 'Uygunsuz içerik']
        );
        
        // Update report count
        await pool.query(
            'UPDATE posts SET reported_count = reported_count + 1 WHERE id = $1',
            [postId]
        );
        
        // Auto-hide if reported 5+ times
        const post = await pool.query('SELECT reported_count FROM posts WHERE id = $1', [postId]);
        if (post.rows[0]?.reported_count >= 5) {
            await pool.query('UPDATE posts SET is_hidden = TRUE WHERE id = $1', [postId]);
        }
    }
}

