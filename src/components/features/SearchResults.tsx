
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SearchResult, SearchMode } from '@/lib/types';
import { ArrowLeft, BookText, Sparkles, Brain, Loader2, RefreshCw } from 'lucide-react';
import { findParallelsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { supportedScriptures } from '@/lib/data';
import { MultiSelect, type Option } from '@/components/ui/multi-select';

interface SearchResultsProps {
    result: SearchResult;
    onClear: () => void;
}

export function SearchResults({ result, onClear }: SearchResultsProps) {
  const { verse, analysis, parallels: initialParallels, initialMode } = result;
  const [parallels, setParallels] = useState(initialParallels?.parallels || []);
  const [currentParallelSources, setCurrentParallelSources] = useState<string[]>([]);
  const [currentSourceOptions, setCurrentSourceOptions] = useState<Option[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const newSourceOptions = supportedScriptures[initialMode]
        .filter(source => source !== 'Default (All Religious Texts)' && source !== 'Default (All Spiritual Texts)' && source !== 'Default (All Non-Religious Texts)' && source !== 'Default (All Texts)')
        .map(source => ({ value: source, label: source }));

    setCurrentSourceOptions(newSourceOptions);
    setCurrentParallelSources([]);
    setParallels(initialParallels?.parallels || []);
  }, [initialMode, initialParallels]);


  const handleSearchParallels = () => {
     startTransition(async () => {
        const sourcesToFetch = currentParallelSources.length > 0 ? currentParallelSources : undefined;
        const { parallels: newParallels, error } = await findParallelsAction(verse.text, verse.tradition, initialMode, sourcesToFetch);

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Error refreshing parallels',
                description: error,
            });
        } else {
            setParallels(newParallels || []);
        }
    });
  }

  return (
    <>
      <div className="animate-in fade-in-50">
        <div className="space-y-8">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={onClear}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Search
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
              <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <BookText className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Cross-Tradition Parallels</CardTitle>
                      </div>
                  </div>
                   <div className="flex items-center gap-2 mt-4">
                      <MultiSelect
                          options={currentSourceOptions}
                          onValueChange={setCurrentParallelSources}
                          defaultValue={currentParallelSources}
                          placeholder={`Search in specific ${initialMode} texts...`}
                          className="w-full"
                          disabled={isPending}
                      />
                       <Button size="icon" onClick={handleSearchParallels} disabled={isPending}>
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Refresh Parallels</span>
                       </Button>
                   </div>
              </CardHeader>
              <CardContent>
                {isPending ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ul className="space-y-4">
                    {parallels.length > 0 ? parallels.map((parallel, index) => (
                        <li key={index} className="flex gap-3">
                        <BookText className="h-5 w-5 mt-1 text-accent-foreground flex-shrink-0" />
                        <p className="text-base flex-1">{parallel}</p>
                        </li>
                    )) : <p className='text-muted-foreground'>No parallels found for this filter. Try a broader search.</p>}
                    </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
