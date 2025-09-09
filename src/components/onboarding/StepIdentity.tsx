'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { UserProfile } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface StepIdentityProps {
  onNext: (data: Partial<UserProfile>) => void;
}

const identities = [
  { value: "Religious", label: "Religious" },
  { value: "Spiritual", label: "Spiritual but not religious" },
  { value: "Non-religious", label: "Non-religious / Humanist" },
];

export function StepIdentity({ onNext }: StepIdentityProps) {
  
  const handleSelect = (identity: "Religious" | "Spiritual" | "Non-religious") => {
      onNext({ identity });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Which best describes you?</CardTitle>
        <CardDescription>Please choose one option to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {identities.map(({ value, label }) => (
            <Button
              key={value}
              variant="outline"
              className="w-full h-16 text-lg justify-start p-6"
              onClick={() => handleSelect(value as any)}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}