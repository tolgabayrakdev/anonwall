// Anonymous identity generation utilities

const adjectives = [
    'Sessiz', 'Hızlı', 'Bilinmeyen', 'Gizemli', 'Anonim', 'Saklı', 'Gizli',
    'Yüzen', 'Uçan', 'Koşan', 'Dans Eden', 'Şarkı Söyleyen', 'Gülen',
    'Düşünen', 'Hayal Eden', 'Yazan', 'Okuyan', 'İzleyen', 'Dinleyen'
];

const nouns = [
    'Kedi', 'Köpek', 'Kuş', 'Balık', 'Yıldız', 'Ay', 'Güneş', 'Bulut',
    'Ağaç', 'Çiçek', 'Deniz', 'Dağ', 'Nehir', 'Rüzgar', 'Kar', 'Yağmur',
    'Gece', 'Gündüz', 'Sabah', 'Akşam', 'Mevsim', 'Yol', 'Kapı', 'Pencere'
];

const avatars = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '🤧', '🥵', '🥶', '😶‍🌫️', '😵', '😵‍💫', '🤯', '🤠', '🥳', '🥸'
];

export function generateAnonymousUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 9999);
    return `${adj}${noun}${num}`;
}

export function generateAnonymousAvatar() {
    return avatars[Math.floor(Math.random() * avatars.length)];
}

export function generateAnonymousId() {
    return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
}

