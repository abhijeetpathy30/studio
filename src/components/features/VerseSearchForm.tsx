'use client';

import { useState, useImperativeHandle, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface VerseSearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export interface VerseSearchFormRef {
  reset: () => void;
  setQuery: (query: string) => void;
}

export const VerseSearchForm = forwardRef<VerseSearchFormRef, VerseSearchFormProps>(({ onSearch, isLoading }, ref) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  useImperativeHandle(ref, () => ({
    reset: () => setQuery(''),
    setQuery: (newQuery: string) => setQuery(newQuery),
  }));

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a verse, topic, or source (e.g., 'love', 'Romans 12:21')"
          className="w-full pl-11 pr-24 h-12 text-base rounded-full"
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 rounded-full px-5"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
        </Button>
      </div>
    </form>
  );
});

VerseSearchForm.displayName = 'VerseSearchForm';
