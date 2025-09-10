
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { SearchResult } from '@/lib/types';
import { ArrowLeft, BookText, Sparkles, Brain, Share2, Copy, MessageSquare, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SocialIcon } from 'react-social-icons';


interface SearchResultsProps {
    result: SearchResult;
    onClear: () => void;
}

export function SearchResults({ result, onClear }: SearchResultsProps) {
  const { verse, analysis, parallels } = result;
  const { toast } = useToast();
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this piece of wisdom I found on The Wisdom Way: "${verse.text}" - ${verse.source}`;
  const quotationText = `"${verse.text}" - ${verse.source}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Wisdom from ${verse.tradition}`)}&summary=${encodeURIComponent(shareText)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(`A Piece of Wisdom from The Wisdom Way`)}&body=${encodeURIComponent(shareText)}`;
  const smsShareUrl = `sms:?body=${encodeURIComponent(shareText)}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(quotationText);
      toast({
        title: 'Text Copied',
        description: 'The quotation has been copied to your clipboard.',
      });
    } catch (error) {
       toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not copy the text.',
      });
    }
  };
  
  const handleNativeShare = async () => {
    const shareData = {
      title: 'A Moment of Wisdom',
      text: quotationText,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support navigator.share
        handleCopyText();
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not share the verse.',
        });
      }
    }
  };


  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={onClear}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Search
        </Button>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {navigator.share && (
                    <>
                      <DropdownMenuItem onClick={handleNativeShare}>
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Share via...</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                )}
                 <DropdownMenuItem onClick={() => window.open(twitterShareUrl, '_blank')}>
                    <SocialIcon network="x" style={{ height: 20, width: 20 }} className="mr-2" />
                    <span>Share on X</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(facebookShareUrl, '_blank')}>
                    <SocialIcon network="facebook" style={{ height: 20, width: 20 }} className="mr-2" />
                    <span>Share on Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(linkedinShareUrl, '_blank')}>
                    <SocialIcon network="linkedin" style={{ height: 20, width: 20 }} className="mr-2" />
                    <span>Share on LinkedIn</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(whatsappShareUrl, '_blank')}>
                    <SocialIcon network="whatsapp" style={{ height: 20, width: 20 }} className="mr-2" />
                    <span>Share on WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => window.location.href = emailShareUrl}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Share via Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = smsShareUrl}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Share via Messages</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyText}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Text</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{verse.source}</CardTitle>
          <CardDescription className="text-base">{verse.tradition}</CardDescription>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
            <p className="text-xl font-body italic">"{verse.text}"</p>
          </blockquote>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">Verse Meaning & Context</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed pt-2 prose prose-sm max-w-none">
                  {analysis.analysis}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">Key Insights & Lessons</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed pt-2 prose prose-sm max-w-none">
                  {analysis.insights}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Philosophical Reflection
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed pt-2 prose prose-sm max-w-none">
                  {analysis.reflection}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <BookText className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Cross-Tradition Parallels</CardTitle>
          </Header>
          <CardContent>
            <ul className="space-y-4">
              {parallels.parallels.length > 0 ? parallels.parallels.map((parallel, index) => (
                <li key={index} className="flex gap-3">
                  <BookText className="h-5 w-5 mt-1 text-accent-foreground flex-shrink-0" />
                  <p className="text-base flex-1">{parallel}</p>
                </li>
              )) : <p className='text-muted-foreground'>No parallels found by the AI.</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
