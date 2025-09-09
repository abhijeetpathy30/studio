'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';

interface StepInterestsProps {
  onNext: (interests: string[]) => void;
  isLoading: boolean;
}

const interestsOptions = ["Justice", "Love", "Compassion", "Courage", "Self-knowledge", "Death", "Purpose", "Forgiveness", "Wisdom"];

export function StepInterests({ onNext, isLoading }: StepInterestsProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const maxSelections = 3;

  const handleToggle = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      }
      if (prev.length < maxSelections) {
        return [...prev, interest];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedInterests.length >= 2) {
      onNext(selectedInterests);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">What themes would you like to explore?</CardTitle>
        <CardDescription>Pick 2–3 that resonate most with you. You have selected {selectedInterests.length} of {maxSelections}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {interestsOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => handleToggle(interest)}
              className={`p-4 border rounded-lg text-center font-medium transition-colors ${
                selectedInterests.includes(interest)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted/50'
              } ${
                selectedInterests.length >= maxSelections && !selectedInterests.includes(interest)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={selectedInterests.length >= maxSelections && !selectedInterests.includes(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
        <Button onClick={handleSubmit} className="w-full h-12 text-lg" disabled={selectedInterests.length < 2 || isLoading}>
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Complete Profile'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}