'use client';

import { useState, useImperativeHandle, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedScriptures } from '@/lib/data';

interface VerseSearchFormProps {
  onSearch: (query: string, source: string) => void;
  isLoading: boolean;
}

export interface VerseSearchFormRef {
  reset: () => void;
  setQuery: (query: string) => void;
}

export const VerseSearchForm = forwardRef<VerseSearchFormRef, VerseSearchFormProps>(({ onSearch, isLoading }, ref) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState(supportedScriptures[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, source);
  };
  
  useImperativeHandle(ref, () => ({
    reset: () => {
      setQuery('');
      setSource(supportedScriptures[0]);
    },
    setQuery: (newQuery: string) => setQuery(newQuery),
  }));

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verse or topic (e.g., 'love', 'Romans 12:21')"
            className="w-full pl-11 h-12 text-base rounded-full"
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Select onValueChange={setSource} value={source} disabled={isLoading}>
                <SelectTrigger className="w-full md:w-[240px] h-12 rounded-full text-base">
                <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                {supportedScriptures.map(scripture => (
                    <SelectItem key={scripture} value={scripture}>{scripture}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <Button
                type="submit"
                className="h-12 rounded-full px-6"
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
            </Button>
        </div>
      </div>
    </form>
  );
});

VerseSearchForm.displayName = 'VerseSearchForm';
