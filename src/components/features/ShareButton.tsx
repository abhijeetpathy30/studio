
'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (navigator.share && window.isSecureContext) {
      setCanShare(true);
    }
  }, []);

  const createShareText = () => {
    return `
Check out this insight from Rational Religion:

Verse: "${result.verse.text}" (${result.verse.source})

AI Analysis: ${result.analysis.analysis.substring(0, 150)}...

A reflection on this verse: ${result.analysis.reflection.substring(0, 150)}...

Explore more at: ${window.location.href}
    `.trim();
  };

  const handleNativeShare = () => {
    const shareData = {
        title: `Insight from Rational Religion: ${result.verse.source}`,
        text: createShareText(),
        url: window.location.href,
    };
    navigator.share(shareData).catch((error) => {
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

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(createShareText());
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
      <Button variant="outline" size="sm" onClick={handleNativeShare}>
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
