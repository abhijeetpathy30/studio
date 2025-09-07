'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [canShare, setCanShare] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // navigator.share is only available in secure contexts (HTTPS)
    // and when the user has granted permission.
    // It must be checked on the client side.
    if (navigator.share && window.isSecureContext) {
      setCanShare(true);
    }
  }, []);

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch (error) {
      // Silently fail if the user cancels the share dialog (AbortError)
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast({
          variant: 'destructive',
          title: "Sharing Failed",
          description: "Could not share the results.",
        });
      }
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
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
