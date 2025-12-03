-- AnonWall Database Schema

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    anonymous_id VARCHAR(50) NOT NULL, -- Random anonymous identifier
    anonymous_username VARCHAR(50) NOT NULL,
    anonymous_avatar VARCHAR(10) NOT NULL, -- Emoji or avatar identifier
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_hidden BOOLEAN DEFAULT FALSE, -- For moderation
    reported_count INTEGER DEFAULT 0
);

-- Likes table (track by IP/fingerprint)
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    fingerprint VARCHAR(100) NOT NULL, -- IP + User-Agent hash or device ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, fingerprint)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    fingerprint VARCHAR(100) NOT NULL,
    reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for registered users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    anonymous_id VARCHAR(50),
    anonymous_username VARCHAR(50),
    anonymous_avatar VARCHAR(10),
    phone_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_code_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Sessions table (for anonymous user tracking)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    anonymous_id VARCHAR(50) NOT NULL,
    anonymous_username VARCHAR(50) NOT NULL,
    anonymous_avatar VARCHAR(10) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON posts(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_anonymous_id ON posts(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_fingerprint ON likes(fingerprint);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Insert default categories
INSERT INTO categories (name, slug, color) VALUES
    ('Genel', 'genel', '#6366f1'),
    ('Eğlence', 'eglence', '#ec4899'),
    ('Teknoloji', 'teknoloji', '#10b981'),
    ('Spor', 'spor', '#f59e0b'),
    ('Sanat', 'sanat', '#8b5cf6'),
    ('Yemek', 'yemek', '#ef4444'),
    ('Seyahat', 'seyahat', '#06b6d4'),
    ('Düşünceler', 'dusunceler', '#84cc16')
ON CONFLICT (slug) DO NOTHING;

