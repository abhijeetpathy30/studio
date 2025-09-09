import type { Verse, SearchMode } from '@/lib/types';

export const themes = ["Compassion", "Justice", "Love", "Wisdom", "Peace", "Humility"];

const religiousScriptures = [
    "Default (All Religious Texts)",
    // Abrahamic
    "Bible (Old & New Testament)",
    "Qur'an",
    "Talmud",
    "Torah",
    "Midrash",
    "Hadith (Sahih al-Bukhari, Sahih Muslim)",
    "Writings of Bahá’u’lláh",
    "Confessions (Augustine)",
    "Summa Theologica (Thomas Aquinas)",
    "Institutes of the Christian Religion (John Calvin)",
    "Ihya Ulum al-Din (Al-Ghazali)",
    "Guide for the Perplexed (Maimonides)",
    // Dharmic
    "Vedas (Rigveda, Samaveda, Yajurveda, Atharvaveda)",
    "Upanishads",
    "Bhagavad Gita",
    "Manusmriti",
    "Ramayana",
    "Mahabharata",
    "Tripitaka / Pali Canon",
    "Mahayana Sutras (Lotus, Heart, Diamond)",
    "Guru Granth Sahib",
    "Agamas",
    "Tattvartha Sutra",
    // Other
    "Avesta",
    "Kojiki",
    "Nihon Shoki",
    "Popol Vuh (Maya)",
    "Epic of Gilgamesh",
];

const spiritualScriptures = [
    "Default (All Spiritual Texts)",
    "Tao Te Ching (Laozi)",
    "Zhuangzi",
    "Dhammapada",
    "Yoga Sutras (Patanjali)",
    "Upanishads",
    "Kabir's Dohas",
    "Masnavi (Rumi)",
    "Divan-e Shams-e Tabrizi (Rumi)",
    "Ethics (Baruch Spinoza)",
    "The Varieties of Religious Experience (William James)",
    "The Enneads (Plotinus)",
    "Sermons and Treatises (Meister Eckhart)",
    "The Heart of Understanding (Thich Nhat Hanh)",
    "Peace Is Every Step (Thich Nhat Hanh)",
    "Talks with Sri Ramana Maharshi",
    "The Power of Now (Eckhart Tolle)",
    "A New Earth (Eckhart Tolle)",
    "The Seven Spiritual Laws of Success (Deepak Chopra)",
    "When Things Fall Apart (Pema Chödrön)",
    "Full Catastrophe Living (Jon Kabat-Zinn)",
    "The Prophet (Kahlil Gibran)",
];

const nonReligiousScriptures = [
    "Default (All Non-Religious Texts)",
    "The Republic (Plato)",
    "Nicomachean Ethics (Aristotle)",
    "Metaphysics (Aristotle)",
    "Meditations (Marcus Aurelius)",
    "Letter to Menoeceus (Epicurus)",
    "An Enquiry Concerning Human Understanding (David Hume)",
    "Critique of Pure Reason (Immanuel Kant)",
    "Groundwork of the Metaphysics of Morals (Immanuel Kant)",
    "Thus Spoke Zarathustra (Friedrich Nietzsche)",
    "Beyond Good and Evil (Friedrich Nietzsche)",
    "Existentialism is a Humanism (Jean-Paul Sartre)",
    "Why I Am Not a Christian (Bertrand Russell)",
    "The Problems of Philosophy (Bertrand Russell)",
    "On Liberty (John Stuart Mill)",
    "Utilitarianism (John Stuart Mill)",
    "On the Origin of Species (Charles Darwin)",
    "Cosmos (Carl Sagan)",
    "The God Delusion (Richard Dawkins)",
    "A Brief History of Time (Stephen Hawking)",
    "Humanist Manifestos (I, II, III)",
    "Practical Ethics (Peter Singer)",
    "The Myth of Sisyphus (Albert Camus)",
    "Creating Capabilities (Martha Nussbaum)",
];

export const supportedScriptures: Record<SearchMode, string[]> = {
    Religious: religiousScriptures,
    Spiritual: spiritualScriptures,
    'Non-Religious': nonReligiousScriptures,
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
