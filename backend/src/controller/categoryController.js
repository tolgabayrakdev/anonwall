import * as categoryService from '../service/categoryService.js';

export async function getAllCategories(req, res) {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Kategoriler yüklenemedi' });
    }
}

