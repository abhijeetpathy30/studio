
'use client';

import { useState, useRef, useTransition } from 'react';
import { VerseSearchForm, type VerseSearchFormRef } from '@/components/features/VerseSearchForm';
import { SearchResults } from '@/components/features/SearchResults';
import { ThemeExplorer } from '@/components/features/ThemeExplorer';
import { searchVerseAction, getRandomFactAction } from '@/app/actions';
import type { SearchResult, SearchMode } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supportedScriptures } from '@/lib/data';
import { Lightbulb, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


export default function Home() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [randomFact, setRandomFact] = useState<string | null>(null);
  const searchFormRef = useRef<VerseSearchFormRef>(null);
  const { toast } = useToast();

  const handleSearch = (text: string, source: string, mode: SearchMode) => {
    if (!text || text.length < 3) {
       toast({
          variant: 'destructive',
          title: 'Invalid Search',
          description: "Please enter at least 3 characters to search.",
        });
      return;
    }
    
    startTransition(async () => {
      setResult(null);
      setRandomFact(null);

      // Fetch a random fact as soon as the search starts
      getRandomFactAction().then(res => {
        if(res.fact) {
            setRandomFact(res.fact);
        }
      });
      
      const formData = new FormData();
      formData.append('query', text);
      formData.append('source', source);
      formData.append('mode', mode);

      const { data, error } = await searchVerseAction(null, formData);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Search Error',
          description: error,
        });
        setResult(null);
      } else {
        setResult(data);
      }
    });
  };

  const handleClear = () => {
    setResult(null);
    searchFormRef.current?.reset();
  };

  const handleThemeSelect = (theme: string) => {
    searchFormRef.current?.setQuery(theme);
    // When exploring themes, default to 'Spiritual' mode for broader results
    handleSearch(theme, supportedScriptures.Spiritual[0], 'Spiritual');
  };
  
  return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight">
            The Wisdom Way
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            An AI-powered tool to explore spiritual and philosophical texts, uncover deep meanings, and find parallels across global traditions.
          </p>
        </section>

        <VerseSearchForm ref={searchFormRef} onSearch={handleSearch} isLoading={isPending} />

        <div className="mt-12">
          {isPending ? (
            <div className="space-y-8 animate-in fade-in-50">
              {randomFact && (
                 <div className="max-w-md mx-auto text-center p-4 border border-border/70 rounded-lg bg-card animate-in fade-in-50">
                  <Lightbulb className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm text-foreground/80 font-medium">Did you know?</p>
                 <p className="text-sm text-foreground/80">{randomFact}</p>
                </div>
              )}
              <Skeleton className="h-32 w-full rounded-lg" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-80 w-full rounded-lg lg:col-span-1" />
                <Skeleton className="h-80 w-full rounded-lg lg:col-span-1" />
                <Skeleton className="h-80 w-full rounded-lg lg:col-span-1" />
              </div>
            </div>
          ) : result ? (
            <SearchResults result={result} onClear={handleClear} />
          ) : (
            <ThemeExplorer onThemeSelect={handleThemeSelect} />
          )}
        </div>
      </main>
  );
}
