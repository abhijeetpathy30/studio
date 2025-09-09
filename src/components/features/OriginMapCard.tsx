'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Map } from 'lucide-react';
import Image from 'next/image';

interface OriginMapCardProps {
    imageUrl: string | null;
    isGenerating: boolean;
    tradition: string;
}

export function OriginMapCard({ imageUrl, isGenerating, tradition }: OriginMapCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Map className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Geographical Origin</CardTitle>
      </CardHeader>
      <CardContent className="aspect-[4/3] relative">
        {isGenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50 rounded-md">
                <Skeleton className="h-full w-full" />
                <p className="absolute text-sm text-muted-foreground animate-pulse">Generating map for {tradition}...</p>
            </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Map illustrating the origin of ${tradition}`}
            fill
            className="object-cover rounded-md border"
            data-ai-hint="world map"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-md">
             <p className="text-sm text-muted-foreground">Could not generate map.</p>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
