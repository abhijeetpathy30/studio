import type { Verse, SearchMode } from '@/lib/types';

export const themes = ["Compassion", "Justice", "Love", "Wisdom", "Peace", "Humility"];

const religiousScripturesRaw = [
    // Abrahamic
    "Bible (Old & New Testament)",
    "Confessions (Augustine)",
    "Guide for the Perplexed (Maimonides)",
    "Hadith (Sahih al-Bukhari, Sahih Muslim)",
    "Ihya Ulum al-Din (Al-Ghazali)",
    "Institutes of the Christian Religion (John Calvin)",
    "Midrash",
    "Qur'an",
    "Summa Theologica (Thomas Aquinas)",
    "Talmud",
    "Torah",
    "Writings of Bahá’u’lláh",
    // Dharmic
    "Agamas",
    "Bhagavad Gita",
    "Guru Granth Sahib",
    "Mahabharata",
    "Mahayana Sutras (Lotus, Heart, Diamond)",
    "Manusmriti",
    "Ramayana",
    "Tattvartha Sutra",
    "Tripitaka / Pali Canon",
    "Upanishads",
    "Vedas (Rigveda, Samaveda, Yajurveda, Atharvaveda)",
    // Other
    "Avesta",
    "Epic of Gilgamesh",
    "Kojiki",
    "Nihon Shoki",
    "Popol Vuh (Maya)",
];

const spiritualScripturesRaw = [
    "A New Earth (Eckhart Tolle)",
    "Divan-e Shams-e Tabrizi (Rumi)",
    "Dhammapada",
    "Ethics (Baruch Spinoza)",
    "Full Catastrophe Living (Jon Kabat-Zinn)",
    "Kabir's Dohas",
    "Masnavi (Rumi)",
    "Peace Is Every Step (Thich Nhat Hanh)",
    "Sermons and Treatises (Meister Eckhart)",
    "Talks with Sri Ramana Maharshi",
    "Tao Te Ching (Laozi)",
    "The Enneads (Plotinus)",
    "The Heart of Understanding (Thich Nhat Hanh)",
    "The Power of Now (Eckhart Tolle)",
    "The Prophet (Kahlil Gibran)",
    "The Seven Spiritual Laws of Success (Deepak Chopra)",
    "The Varieties of Religious Experience (William James)",
    "Upanishads",
    "When Things Fall Apart (Pema Chödrön)",
    "Yoga Sutras (Patanjali)",
    "Zhuangzi",
];

const nonReligiousScripturesRaw = [
    "A Brief History of Time (Stephen Hawking)",
    "An Enquiry Concerning Human Understanding (David Hume)",
    "Beyond Good and Evil (Friedrich Nietzsche)",
 "Cosmos (Carl Sagan)",
    "Creating Capabilities (Martha Nussbaum)",
    "Critique of Pure Reason (Immanuel Kant)",
    "Existentialism is a Humanism (Jean-Paul Sartre)",
    "Groundwork of the Metaphysics of of Morals (Immanuel Kant)",
    "Humanist Manifestos (I, II, III)",
    "Letter to Menoeceus (Epicurus)",
    "Meditations (Marcus Aurelius)",
    "Metaphysics (Aristotle)",
    "Nicomachean Ethics (Aristotle)",
    "On Liberty (John Stuart Mill)",
    "On the Origin of Species (Charles Darwin)",
    "Practical Ethics (Peter Singer)",
    "The God Delusion (Richard Dawkins)",
    "The Myth of Sisyphus (Albert Camus)",
    "The Problems of Philosophy (Bertrand Russell)",
    "The Republic (Plato)",
    "Thus Spoke Zarathustra (Friedrich Nietzsche)",
    "Utilitarianism (John Stuart Mill)",
    "Why I Am Not a Christian (Bertrand Russell)",
];


export const religiousScriptures = ["Default (All Religious Texts)", ...religiousScripturesRaw.sort()];
export const spiritualScriptures = ["Default (All Spiritual Texts)", ...spiritualScripturesRaw.sort()];
export const nonReligiousScriptures = ["Default (All Non-Religious Texts)", ...nonReligiousScripturesRaw.sort()];
export const universalistScriptures = ["Default (All Texts)", ...Array.from(new Set([...religiousScripturesRaw, ...spiritualScripturesRaw, ...nonReligiousScripturesRaw])).sort()];


export const supportedScriptures: Record<SearchMode, string[]> = {
    Religious: religiousScriptures,
    Spiritual: spiritualScriptures,
    'Non-Religious': nonReligiousScriptures,
    Universalist: universalistScriptures,
};


// This data is now for theme exploration fallback and initial display.
// The primary search functionality uses the getVerse AI flow.
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

// This function is now primarily a fallback for theme exploration.
export const findVerseByQuery = (query: string): Verse | undefined => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Match on theme for the theme explorer feature
    const themeMatch = verses.find(v => v.themes.some(theme => theme.toLowerCase() === normalizedQuery));
    if (themeMatch) return themeMatch;

    // Fallback to searching the small hardcoded list
    const sourceMatch = verses.find(v => v.source.toLowerCase().includes(normalizedQuery));
    if (sourceMatch) return sourceMatch;
    
    const textMatch = verses.find(v => v.text.toLowerCase().includes(normalizedQuery));
    if (textMatch) return textMatch;

    return undefined;
};

export const findVersesByTheme = (theme: string): Verse[] => {
    const normalizedTheme = theme.toLowerCase().trim();
    return verses.filter(v => v.themes.some(t => t.toLowerCase() === normalizedTheme));
}
