'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserProfile } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface StepTraditionsProps {
  onNext: (data: Partial<UserProfile>) => void;
  identity: UserProfile['identity'];
}

const traditionOptions = {
    Religious: ["Christianity", "Islam", "Hinduism", "Buddhism", "Judaism", "Sikhism"],
    Spiritual: ["Stoicism", "Taoism", "Vedanta", "Mindfulness", "New Age"],
    'Non-religious': ["Ethics", "Humanism", "Psychology", "Philosophy", "Literature"],
};

export function StepTraditions({ onNext, identity }: StepTraditionsProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState('');

  const options = traditionOptions[identity] || [];
  
  const title = {
    Religious: "Which traditions would you like to focus on?",
    Spiritual: "Which philosophies or wisdom traditions resonate with you most?",
    'Non-religious': "Which themes interest you most?",
  }[identity];
  
  const description = {
    Religious: "You can select multiple traditions.",
    Spiritual: "Select all that apply.",
    'Non-religious': "Select all that apply.",
  }[identity];


  const handleToggle = (option: string) => {
    setSelected(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };
  
  const handleSubmit = () => {
    const finalSelections = otherValue.trim() ? [...selected, otherValue.trim()] : selected;
    if (finalSelections.length > 0) {
      onNext({ selectedTraditions: finalSelections });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50">
              <Checkbox
                id={option}
                checked={selected.includes(option)}
                onCheckedChange={() => handleToggle(option)}
                className="h-6 w-6"
              />
              <Label htmlFor={option} className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {option}
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-3 p-3">
             <Input
                type="text"
                placeholder="Other..."
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                className="h-12 text-lg"
              />
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full h-12 text-lg" disabled={selected.length === 0 && !otherValue.trim()}>
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}