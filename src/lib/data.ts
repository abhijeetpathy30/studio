import type { Verse } from '@/lib/types';

export const themes = ["Compassion", "Justice", "Love", "Wisdom", "Peace", "Humility"];

export const verses: Verse[] = [
    {
        id: "1",
        text: "Do not be overcome by evil, but overcome evil with good.",
        source: "Romans 12:21",
        tradition: "Christianity",
        themes: ["Love", "Peace"]
    },
    {
        id: "2",
        text: "The best among you are those who have the best manners and character.",
        source: "Sahih al-Bukhari 3559",
        tradition: "Islam",
        themes: ["Humility", "Compassion"]
    },
    {
        id: "3",
        text: "The wise man should restrain his senses like a tortoise withdrawing its limbs into its shell.",
        source: "Bhagavad Gita 2.58",
        tradition: "Hinduism",
        themes: ["Wisdom", "Humility"]
    },
    {
        id: "4",
        text: "Hatred does not cease by hatred, but only by love; this is the eternal rule.",
        source: "Dhammapada 5",
        tradition: "Buddhism",
        themes: ["Love", "Peace", "Compassion"]
    },
    {
        id: "5",
        text: "What is hateful to you, do not do to your fellow: that is the whole Torah; the rest is the explanation; go and learn.",
        source: "Talmud, Shabbat 31a",
        tradition: "Judaism",
        themes: ["Justice", "Love", "Compassion"]
    },
    {
        id: "6",
        text: "The journey of a thousand miles begins with a single step.",
        source: "Tao Te Ching 64",
        tradition: "Taoism",
        themes: ["Wisdom", "Humility"]
    },
    {
        id: '7',
        text: 'He who knows others is wise; he who knows himself is enlightened.',
        source: 'Tao Te Ching 33',
        tradition: 'Taoism',
        themes: ['Wisdom', 'Humility'],
    },
    {
        id: '8',
        text: 'The Lord is my shepherd; I shall not want.',
        source: 'Psalm 23:1',
        tradition: 'Christianity',
        themes: ['Peace', 'Compassion'],
    },
    {
        id: '9',
        text: 'Indeed, with hardship will be ease.',
        source: 'Quran 94:6',
        tradition: 'Islam',
        themes: ['Peace', 'Humility'],
    },
    {
        id: '10',
        text: 'Justice, justice shall you pursue.',
        source: 'Deuteronomy 16:20',
        tradition: 'Judaism',
        themes: ['Justice'],
    },
    {
        id: '11',
        text: 'From the unreal lead me to the real, from darkness lead me to light, from death lead me to immortality.',
        source: 'Brihadaranyaka Upanishad 1.3.28',
        tradition: 'Hinduism',
        themes: ['Wisdom'],
    },
    {
        id: '12',
        text: 'The mind is everything. What you think you become.',
        source: 'Dhammapada',
        tradition: 'Buddhism',
        themes: ['Wisdom', 'Humility'],
    },
    {
        id: '13',
        text: 'By conquering yourself, you have conquered the world.',
        source: 'Guru Granth Sahib',
        tradition: 'Sikhism',
        themes: ['Wisdom', 'Humility'],
    },
    {
        id: '14',
        text: 'The essence of the Way is detachment.',
        source: 'Zhuangzi',
        tradition: 'Taoism',
        themes: ['Wisdom', 'Peace'],
    },
    {
        id: '15',
        text: 'The superior man is modest in his speech, but exceeds in his actions.',
        source: 'Analects of Confucius',
        tradition: 'Confucianism',
        themes: ['Humility', 'Justice'],
    },
    {
        id: '16',
        text: 'The earth is but one country, and mankind its citizens.',
        source: 'Gleanings from the Writings of Bahá’u’lláh',
        tradition: 'Baháʼí Faith',
        themes: ['Peace', 'Love', 'Compassion'],
    }
];

export const findVerseByQuery = (query: string): Verse | undefined => {
    const normalizedQuery = query.toLowerCase().trim();

    // Prioritize exact or near-exact source match
    const sourceMatch = verses.find(v => v.source.toLowerCase() === normalizedQuery);
    if (sourceMatch) return sourceMatch;
    
    // Then, check for partial match in the source
    const partialSourceMatch = verses.find(v => 
        v.source.toLowerCase().includes(normalizedQuery)
    );
    if (partialSourceMatch) return partialSourceMatch;

    // Then, check for partial match in the text
    const partialTextMatch = verses.find(v => 
        v.text.toLowerCase().includes(normalizedQuery)
    );
    if (partialTextMatch) return partialTextMatch;
    
    // Finally, match on theme if no source or text match is found
    const themeMatch = verses.find(v => v.themes.some(theme => theme.toLowerCase() === normalizedQuery));
    if (themeMatch) return themeMatch;

    // No match found
    return undefined;
};

export const findVersesByTheme = (theme: string): Verse[] => {
    const normalizedTheme = theme.toLowerCase().trim();
    return verses.filter(v => v.themes.some(t => t.toLowerCase() === normalizedTheme));
}
