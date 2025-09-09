'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StepName } from '@/components/onboarding/StepName';
import { StepIdentity } from '@/components/onboarding/StepIdentity';
import { StepTraditions } from '@/components/onboarding/StepTraditions';
import { StepInterests } from '@/components/onboarding/StepInterests';
import { StepWelcome } from '@/components/onboarding/StepWelcome';
import { Progress } from '@/components/ui/progress';
import { UserProfile } from '@/lib/types';
import { BookHeart } from 'lucide-react';
import { createUserProfile } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const nextStep = () => setStep((s) => s + 1);
  
  const handleUpdateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    nextStep();
  };

  const handleSaveProfile = async (interests: string[]) => {
    const finalProfile: Partial<UserProfile> = { ...profile, interests };
    setProfile(finalProfile);
    setIsSaving(true);
    
    // This is a mock user ID. In a real app, this would come from Firebase Auth.
    const mockUserId = `user_${Date.now()}`;
    
    try {
        await createUserProfile(mockUserId, finalProfile as UserProfile);
        nextStep();
    } catch (error) {
        console.error("Failed to save profile", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'There was a problem saving your profile. Please try again.'
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const totalSteps = 4;
  const progress = (step - 1) / totalSteps * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepName onNext={handleUpdateProfile} />;
      case 2:
        return <StepIdentity onNext={handleUpdateProfile} />;
      case 3:
        return <StepTraditions onNext={handleUpdateProfile} identity={profile.identity!} />;
      case 4:
        return <StepInterests onNext={handleSaveProfile} isLoading={isSaving} />;
      case 5:
        return <StepWelcome profile={profile as UserProfile} onFinish={() => router.push('/')} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center mb-8 gap-3 text-xl font-bold font-headline text-foreground">
             <BookHeart className="h-7 w-7 text-primary" />
             <span>Rational Religion</span>
        </div>

        {step < 5 && (
            <div className="mb-8 px-1">
                <Progress value={progress} className="w-full h-2" />
                <p className="text-sm text-muted-foreground text-center mt-2">Step {step} of {totalSteps}</p>
            </div>
        )}

        <main className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}