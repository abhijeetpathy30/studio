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
    }
];

export const findVerseByQuery = (query: string): Verse | undefined => {
    const normalizedQuery = query.toLowerCase().trim();

    // Prioritize direct source match
    let verse = verses.find(v => v.source.toLowerCase() === normalizedQuery);
    if (verse) return verse;
    
    // Then check for theme match, returning the first verse that matches.
    verse = verses.find(v => v.themes.some(theme => theme.toLowerCase() === normalizedQuery));
    if (verse) return verse;

    // Finally, search within text or source for partial matches.
    return verses.find(v => 
        v.text.toLowerCase().includes(normalizedQuery) || 
        v.source.toLowerCase().includes(normalizedQuery)
    );
};

export const findVersesByTheme = (theme: string): Verse[] => {
    const normalizedTheme = theme.toLowerCase().trim();
    return verses.filter(v => v.themes.some(t => t.toLowerCase() === normalizedTheme));
}
