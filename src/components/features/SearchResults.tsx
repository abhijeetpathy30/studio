
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SearchResult, SearchMode } from '@/lib/types';
import { ArrowLeft, BookText, Sparkles, Brain, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findParallelsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { supportedScriptures } from '@/lib/data';

interface SearchResultsProps {
    result: SearchResult;
    onClear: () => void;
}

export function SearchResults({ result, onClear }: SearchResultsProps) {
  const { verse, analysis, parallels: initialParallels, initialMode } = result;
  const [parallels, setParallels] = useState(initialParallels?.parallels || []);
  const [currentParallelMode, setCurrentParallelMode] = useState<SearchMode>(initialMode);
  const [currentParallelSource, setCurrentParallelSource] = useState<string>('Default');
  const [currentSourceOptions, setCurrentSourceOptions] = useState<string[]>(supportedScriptures[initialMode]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const newSourceOptions = supportedScriptures[currentParallelMode];
    setCurrentSourceOptions(newSourceOptions);
    setCurrentParallelSource('Default');
  }, [currentParallelMode]);


  const handleSearchParallels = (mode: SearchMode, source: string) => {
     startTransition(async () => {
        const sourceToFetch = source === 'Default' ? undefined : source;
        const { parallels: newParallels, error } = await findParallelsAction(verse.text, verse.tradition, mode, sourceToFetch);

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

  const handleModeChange = (newMode: SearchMode) => {
    setCurrentParallelMode(newMode);
    // The useEffect will trigger the source options to update and reset the source dropdown.
    // Then we search with the new mode and the default source.
    handleSearchParallels(newMode, 'Default');
  };

  const handleSourceChange = (newSource: string) => {
      setCurrentParallelSource(newSource);
      handleSearchParallels(currentParallelMode, newSource);
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
                  <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                      <Select onValueChange={(value) => handleModeChange(value as SearchMode)} value={currentParallelMode} disabled={isPending}>
                        <SelectTrigger className="w-full h-9 text-sm">
                          <SelectValue placeholder="Select a worldview" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Universalist">Universalist</SelectItem>
                          <SelectItem value="Spiritual">Spiritual</SelectItem>
                          <SelectItem value="Religious">Religious</SelectItem>
                          <SelectItem value="Non-Religious">Non-Religious</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select onValueChange={handleSourceChange} value={currentParallelSource} disabled={isPending}>
                        <SelectTrigger className="w-full h-9 text-sm">
                          <SelectValue placeholder="Select a source" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentSourceOptions.map(source => (
                              <SelectItem key={source} value={source}>
                                {source.startsWith('Default') ? source : source}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    )) : <p className='text-muted-foreground'>No parallels found for this worldview{currentParallelSource !== 'Default' ? ` in ${currentParallelSource}` : ''}.</p>}
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
