
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SearchResult } from '@/lib/types';
import { ArrowLeft, BookText, Sparkles, Brain, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface SearchResultsProps {
    result: SearchResult;
    onClear: () => void;
}

export function SearchResults({ result, onClear }: SearchResultsProps) {
  const { verse, analysis, parallels } = result;
  const { toast } = useToast();

  const handleShare = async () => {
    const shareText = `"${verse.text}" - ${verse.source}`;
    const shareData = {
      title: 'A Moment of Wisdom',
      text: shareText,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied to Clipboard',
          description: 'The verse has been copied for you to share.',
        });
      }
    } catch (error: any) {
      // Don't show an error if the user cancels the share dialog.
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error('Error sharing:', error);
      // Fallback for when sharing fails for other reasons
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied to Clipboard',
          description: 'Sharing failed, so the verse has been copied for you.',
        });
      } catch (copyError) {
        console.error('Error copying to clipboard:', copyError);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not share or copy the verse.',
        });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between gap-4">
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
            <BookText className="h-6 w-6 text-primary" />
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
