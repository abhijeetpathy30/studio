'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { UserProfile } from '@/lib/types';
import { PartyPopper } from 'lucide-react';

interface StepWelcomeProps {
  profile: UserProfile;
  onFinish: () => void;
}

export function StepWelcome({ profile, onFinish }: StepWelcomeProps) {

  const getWelcomeMessage = () => {
    switch (profile.identity) {
        case 'Religious':
            return `Welcome, ${profile.name}. We’ll highlight verses and teachings from the traditions you’ve selected — ${profile.selectedTraditions.join(', ')}. You’ll also discover universal connections across different faiths.`;
        case 'Spiritual':
            return `Welcome, ${profile.name}. We’ll bring you insights from ${profile.selectedTraditions.join(', ')} and other spiritual wisdom that resonates with your journey, alongside timeless reflections from across traditions.`;
        case 'Non-religious':
            return `Welcome, ${profile.name}. We’ll focus on humanistic, philosophical, and ethical reflections from traditions like ${profile.selectedTraditions.join(', ')} — while also showing how great thinkers across cultures approached ideas like ${profile.interests.join(', ')}.`;
        default:
            return `Thank you, ${profile.name}! Your profile is set. From now on, we’ll guide you through wisdom and insights tailored to your journey. Let’s begin exploring together.`
    }
  }


  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center items-center">
        <PartyPopper className="h-12 w-12 text-yellow-500 mb-4" />
        <CardTitle className="text-2xl font-headline">Thank you, {profile.name}!</CardTitle>
        <CardDescription className="text-lg leading-relaxed mt-2">
            {getWelcomeMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onFinish} className="w-full h-12 text-lg">
          Let's Begin Exploring
        </Button>
      </CardContent>
    </Card>
  );
}