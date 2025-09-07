import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SearchResult } from '@/lib/types';
import { ArrowLeft, BookText, Share2, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SearchResults({ result, onClear }: { result: SearchResult; onClear: () => void; }) {
  const { verse, analysis, parallels } = result;
  const { toast } = useToast();

  const handleShare = async () => {
    const shareText = `
Check out this insight from Rational Religion:

Verse: "${verse.text}" (${verse.source})

AI Analysis: ${analysis.analysis.substring(0, 150)}...

A reflection on this verse: ${analysis.reflection.substring(0, 150)}...

Explore more at: ${window.location.href}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Insight from Rational Religion: ${verse.source}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        // Silently fail if the user cancels the share dialog
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
            title: "Copied to Clipboard",
            description: "The search results have been copied for you to share.",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({
            variant: 'destructive',
            title: "Copy Failed",
            description: "Could not copy results to clipboard.",
        });
      }
    }
  };


  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onClear}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Search
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{verse.source}</CardTitle>
          <CardDescription className="text-base">{verse.tradition}</CardDescription>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
            <p className="text-xl font-body italic">"{verse.text}"</p>
          </blockquote>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">Verse Meaning & Context</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed pt-2 prose prose-sm max-w-none">
                  {analysis.analysis}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">Key Insights & Lessons</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed pt-2 prose prose-sm max-w-none">
                  {analysis.insights}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Philosophical Reflection
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed pt-2 prose prose-sm max-w-none">
                  {analysis.reflection}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Share2 className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Cross-Tradition Parallels</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {parallels.parallels.length > 0 ? parallels.parallels.map((parallel, index) => (
                <li key={index} className="flex gap-3">
                  <BookText className="h-5 w-5 mt-1 text-accent-foreground flex-shrink-0" />
                  <p className="text-base flex-1">{parallel}</p>
                </li>
              )) : <p className='text-muted-foreground'>No parallels found by the AI.</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
