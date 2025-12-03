// Seed script to populate database with 100 test posts
// Run: npm run seed

import pool from './database.js';
import { generateAnonymousUsername, generateAnonymousAvatar } from '../utils/anonymous.js';

const contents = [
    'Bugün çok güzel bir gün geçirdim! 🌞',
    'Kimse beni anlamıyor sanırım...',
    'Hayat bazen çok zor ama devam etmek lazım 💪',
    'Bugün yeni bir şey öğrendim, çok mutluyum!',
    'Bazen sessizlik en iyi cevaptır',
    'Arkadaşlarımla harika vakit geçirdik!',
    'Yeni bir teknoloji keşfettim, çok heyecanlı!',
    'Spor yapmak beni çok rahatlatıyor',
    'Sanat gerçekten hayatı güzelleştiriyor',
    'Yemek yapmak benim hobim',
    'Seyahat etmek beni özgürleştiriyor',
    'Düşüncelerim beni yoruyor ama umutlu olmak istiyorum',
    'Bugün çok komik bir video izledim, gülmekten kırıldım 😂',
    'Yeni bir şaka öğrendim: Neden matematikçiler asla üşümez? Çünkü sonsuz dereceleri var! 😄',
    'Bugün dans ettim, çok eğlenceliydi!',
    'Komik bir meme gördüm, paylaşmak istedim 😆',
    'AI teknolojisi gerçekten inanılmaz bir şey',
    'Bugün yeni bir uygulama keşfettim, çok kullanışlı!',
    'Blockchain teknolojisi geleceği değiştirecek',
    'Yeni bir gadget aldım, çok memnunum!',
    'Bugün koşu yaptım, kendimi çok iyi hissediyorum!',
    'Futbol maçı izledim, çok heyecanlıydı!',
    'Yoga yapmak gerçekten çok rahatlatıcı',
    'Basketbol oynadım, harika bir antrenman oldu!',
    'Yüzme çok iyi bir egzersiz, herkese tavsiye ederim',
    'Bugün resim yaptım, çok güzel oldu!',
    'Yeni bir müzik keşfettim, çok etkileyici',
    'Şiir yazmak beni çok rahatlatıyor',
    'Fotoğraf çekmeyi çok seviyorum',
    'Tiyatro oyunu izledim, muhteşemdi!',
    'Bugün çok lezzetli bir yemek yaptım!',
    'Yeni bir restoran keşfettim, kesinlikle gidilmeli!',
    'Tatlı yapmak benim hobim, bugün de harika bir şey yaptım',
    'Kahve içmek benim için bir ritüel',
    'Bugün pizza yedim, çok lezzetliydi!',
    'Yeni bir şehir keşfettim, çok güzel bir yer!',
    'Tatil planları yapıyorum, çok heyecanlıyım!',
    'Doğa yürüyüşü yaptım, harika bir deneyimdi',
    'Yeni bir ülke gördüm, kültürü çok ilginç',
    'Kamp yapmak benim için en iyi aktivite',
    'Hayat hakkında düşünüyorum...',
    'Bazen her şeyin bir anlamı olduğunu düşünüyorum',
    'Gelecek hakkında endişeleniyorum ama umutlu da olmak istiyorum',
    'İnsanlar neden bu kadar karmaşık?',
    'Mutluluk nedir gerçekten?',
];

const categories = [1, 2, 3, 4, 5, 6, 7, 8]; // Category IDs

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...');
        
        // Check if posts already exist
        const existingPosts = await pool.query('SELECT COUNT(*) FROM posts');
        if (parseInt(existingPosts.rows[0].count) > 0) {
            console.log('⚠️  Posts already exist. Skipping seed.');
            console.log(`   Current post count: ${existingPosts.rows[0].count}`);
            process.exit(0);
        }

        console.log('📝 Generating 100 posts...');
        
        for (let i = 1; i <= 100; i++) {
            // Random category (20% chance of no category)
            const categoryId = Math.random() > 0.2 
                ? categories[Math.floor(Math.random() * categories.length)]
                : null;
            
            // Random content
            const content = contents[Math.floor(Math.random() * contents.length)];
            
            // Generate anonymous identity
            const anonymousId = `anon_seed_${i}_${Date.now()}`;
            const anonymousUsername = generateAnonymousUsername();
            const anonymousAvatar = generateAnonymousAvatar();
            
            // Random likes (0-100)
            const likesCount = Math.floor(Math.random() * 100);
            
            // Random days ago (0-30 days)
            const daysAgo = Math.floor(Math.random() * 30);
            
            await pool.query(
                `INSERT INTO posts (content, category_id, anonymous_id, anonymous_username, anonymous_avatar, likes_count, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '${daysAgo} days')`,
                [content, categoryId, anonymousId, anonymousUsername, anonymousAvatar, likesCount]
            );
            
            if (i % 10 === 0) {
                console.log(`   ✓ Generated ${i}/100 posts...`);
            }
        }
        
        // Generate random likes for posts
        console.log('❤️  Generating likes...');
        const postsResult = await pool.query('SELECT id, likes_count FROM posts WHERE likes_count > 0');
        
        for (const post of postsResult.rows) {
            const likeCount = Math.min(post.likes_count, 20);
            for (let i = 0; i < likeCount; i++) {
                const fingerprint = `fingerprint_${post.id}_${i}_${Math.floor(Math.random() * 1000000)}`;
                try {
                    await pool.query(
                        'INSERT INTO likes (post_id, fingerprint) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                        [post.id, fingerprint]
                    );
                } catch (error) {
                    // Ignore duplicate errors
                }
            }
        }
        
        // Update likes_count to match actual likes
        await pool.query(`
            UPDATE posts SET likes_count = (
                SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id
            )
        `);
        
        const countResult = await pool.query('SELECT COUNT(*) FROM posts');
        const likesResult = await pool.query('SELECT COUNT(*) FROM likes');
        
        console.log(`✅ Database seeded successfully!`);
        console.log(`   📊 Total posts: ${countResult.rows[0].count}`);
        console.log(`   ❤️  Total likes: ${likesResult.rows[0].count}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seedDatabase();

