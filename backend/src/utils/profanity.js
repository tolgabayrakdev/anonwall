// Simple profanity filter (Turkish + English)
// For MVP, using a basic word list. Can be enhanced with a library later.

const profanityWords = [
    // Turkish profanity (common ones)
    'küfür', 'spam', 'reklam',
    // English profanity (common ones)
    'spam', 'advertisement', 'scam'
];

export function containsProfanity(text) {
    const lowerText = text.toLowerCase();
    return profanityWords.some(word => lowerText.includes(word));
}

export function filterProfanity(text) {
    let filtered = text;
    profanityWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    return filtered;
}

