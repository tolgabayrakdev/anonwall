import pool from '../config/database.js';

export async function getAllCategories() {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
}

export async function getCategoryBySlug(slug) {
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    return result.rows[0];
}

