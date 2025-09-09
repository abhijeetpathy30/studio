
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-center tracking-tight">
                How It Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-lg text-foreground/80 leading-relaxed prose prose-lg max-w-none">
                <p>
                  I've always been fascinated by the big questions in life and the beautiful, diverse ways people have tried to answer them throughout history. It often seems like we focus on what divides us, but I was curious about the opposite. I wanted to find the common threads of wisdom that connect us all.
                </p>
                <p>
                  The Wisdom Way started as a personal project to help me find clarity for the things on my own mind. It was a tool for my own curiosity, a way to easily access profound philosophical and spiritual knowledge whenever I felt stuck or needed a new perspective.
                </p>
                <p>
                  My hope is that this app can do the same for you. It’s here to foster a sense of unity and spark your own curiosity. It’s a simple step to help you find a piece of wisdom that speaks to you, right when you need it, and to see how people from all walks of life have wrestled with the very same questions you might have.
                </p>
            </CardContent>
          </Card>
        </div>
      </main>
  );
}
