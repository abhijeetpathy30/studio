import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-center tracking-tight">
                About The Wisdom Way
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-lg text-foreground/80 leading-relaxed prose prose-lg max-w-none">
                <p>
                    Our mission is to foster a sense of unity across religions, cultures, believers, and non-believers by making the world’s philosophical knowledge easily accessible. In a world that often highlights our differences, The Wisdom Way seeks to uncover the profound threads of wisdom that connect us all. 
                </p>
                <p>
                    Whether you are wrestling with a tough question, seeking a new perspective, or simply curious about what different traditions have to say about life's big questions, this tool is designed for you. It's a step to find clarity for anything that's on your mind.
                </p>
                <p>
                    We believe that by exploring these shared insights, we can spark curiosity, encourage dialogue, and find more common ground.
                </p>
            </CardContent>
          </Card>
        </div>
      </main>
  );
}
