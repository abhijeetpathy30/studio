'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface StepNameProps {
  onNext: (data: Partial<UserProfile>) => void;
}

export function StepName({ onNext }: StepNameProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext({ name: name.trim() });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Welcome!</CardTitle>
        <CardDescription>To personalize your experience, may we know your name?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-lg text-center"
            required
            autoFocus
          />
          <Button type="submit" className="w-full h-12 text-lg" disabled={!name.trim()}>
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}