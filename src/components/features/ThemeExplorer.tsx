import { themes } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Bird, Heart, HeartHandshake, Scale, PersonStanding } from 'lucide-react';

const themeIcons: { [key: string]: React.ReactElement } = {
  Compassion: <HeartHandshake className="h-8 w-8 text-primary" />,
  Justice: <Scale className="h-8 w-8 text-primary" />,
  Love: <Heart className="h-8 w-8 text-primary" />,
  Wisdom: <BrainCircuit className="h-8 w-8 text-primary" />,
  Peace: <Bird className="h-8 w-8 text-primary" />,
  Humility: <PersonStanding className="h-8 w-8 text-primary" />,
};

export function ThemeExplorer({ onThemeSelect }: { onThemeSelect: (theme: string) => void; }) {
  return (
    <div className="animate-in fade-in-50">
      <h2 className="text-3xl font-bold font-headline mb-8 text-center">Or, Explore by Theme</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => onThemeSelect(theme)}
            className="text-left w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Explore theme: ${theme}`}
          >
            <Card className="group h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {themeIcons[theme] || <Heart className="h-8 w-8 text-primary" />}
                    <h3 className="font-headline text-2xl font-semibold">{theme}</h3>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
