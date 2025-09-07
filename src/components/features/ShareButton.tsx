
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SearchResult } from '@/lib/types';

interface ShareButtonProps {
  result: SearchResult;
}

export function ShareButton({ result }: ShareButtonProps) {
  const [canShare, setCanShare] = useState(false);
  const { toast } = useToast();
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // navigator.share is only available in secure contexts (https)
    // and when the browser implements the Web Share API.
    if (navigator.share && window.isSecureContext) {
      setCanShare(true);
    }
  }, []);

  useEffect(() => {
    const button = shareButtonRef.current;
    if (!button || !canShare) return;

    // Bypassing React's event system to ensure the call is a direct
    // result of a user gesture. This is the most robust way to avoid
    // "Permission Denied" errors.
    const handleNativeShare = (event: MouseEvent) => {
      event.preventDefault();
      navigator.share({
          title: `Insight from Rational Religion: ${result.verse.source}`,
          text: `Check out this insight on Rational Religion.`,
          url: window.location.href,
      }).catch((error) => {
         // AbortError is thrown when the user cancels the share dialog.
         // We can safely ignore it.
         if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({
            variant: 'destructive',
            title: "Sharing Failed",
            description: "Could not share the results.",
          });
        }
      });
    };
    
    button.addEventListener('click', handleNativeShare);

    return () => {
      button.removeEventListener('click', handleNativeShare);
    };
  }, [canShare, result, toast]);

  const handleCopyToClipboard = async () => {
    const shareText = `
Check out this insight from Rational Religion:

Verse: "${result.verse.text}" (${result.verse.source})

AI Analysis: ${result.analysis.analysis.substring(0, 150)}...

A reflection on this verse: ${result.analysis.reflection.substring(0, 150)}...

Explore more at: ${window.location.href}
    `.trim();

    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "The search results have been copied for you to share.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        variant: 'destructive',
        title: "Copy Failed",
        description: "Could not copy results to clipboard.",
      });
    }
  };

  if (canShare) {
    return (
      <Button 
        ref={shareButtonRef}
        variant="outline" 
        size="sm" 
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
      <Copy className="mr-2 h-4 w-4" />
      Copy to Clipboard
    </Button>
  );
}
