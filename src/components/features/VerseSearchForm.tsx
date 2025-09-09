
'use client';

import { useState, useImperativeHandle, forwardRef, useRef, useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Mic, MicOff, Book, Sparkles, User, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedScriptures } from '@/lib/data';
import { transcribeAudioAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { SearchMode } from '@/lib/types';

interface VerseSearchFormProps {
  onSearch: (query: string, source: string, mode: SearchMode) => void;
  isLoading: boolean;
}

export interface VerseSearchFormRef {
  reset: () => void;
  setQuery: (query: string) => void;
}

const modeDescriptions: Record<SearchMode, string> = {
  Religious: 'Searches sacred scriptures and theological writings (e.g., Bible, Qur’an, Vedas). Focuses on texts considered authoritative within established religious traditions.',
  Spiritual: 'Searches mystical, meditative, or reflective texts (e.g., Rumi, Tao Te Ching, Stoic philosophy). Focuses on inner discovery and transcendent themes outside of institutional religion.',
  'Non-Religious': 'Searches philosophical treatises, scientific works, and humanist writings (e.g., Aristotle, Kant, Bertrand Russell). Focuses on reason, evidence, and secular ethics.',
  Universalist: 'Searches across all available texts—religious, spiritual, and non-religious. Finds the best match from the entire library of human wisdom.'
};

export const VerseSearchForm = forwardRef<VerseSearchFormRef, VerseSearchFormProps>(({ onSearch, isLoading }, ref) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('Universalist');
  const [currentScriptures, setCurrentScriptures] = useState(supportedScriptures.Universalist);
  const [source, setSource] = useState(currentScriptures[0]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, startTranscriptionTransition] = useTransition();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const newScriptures = supportedScriptures[mode];
    setCurrentScriptures(newScriptures);
    setSource(newScriptures[0]);
  }, [mode]);


  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          startTranscriptionTransition(async () => {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Audio = reader.result as string;
              const { text, error } = await transcribeAudioAction(base64Audio);

              if (error || !text) {
                toast({
                    variant: 'destructive',
                    title: 'Transcription Error',
                    description: error || "Could not transcribe audio. Please try again.",
                });
                return;
              }

              setQuery(text);
              onSearch(text, source, mode);
            };
          });
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        toast({
            variant: 'destructive',
            title: 'Microphone Error',
            description: 'Could not access the microphone. Please ensure you have given permission in your browser settings.',
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, source, mode);
  };
  
  useImperativeHandle(ref, () => ({
    reset: () => {
      setQuery('');
      setMode('Universalist');
      const defaultScriptures = supportedScriptures['Universalist'];
      setCurrentScriptures(defaultScriptures);
      setSource(defaultScriptures[0]);
    },
    setQuery: (newQuery: string) => setQuery(newQuery),
  }));
  
  const isBusy = isLoading || isTranscribing;

  const renderModeOption = (value: SearchMode, id: string, Icon: React.ElementType, label: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center">
            <RadioGroupItem value={value} id={id} />
            <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-base pl-2">
                <Icon className="h-5 w-5" />
                {label}
            </Label>
        </div>
      </TooltipTrigger>
      <TooltipContent className='max-w-xs'>
        <p>{modeDescriptions[value]}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRecording ? "Recording... speak now" : isTranscribing ? "Transcribing..." : "Search for a topic, question, or verse..."}
            className="w-full pl-11 h-12 text-base"
            disabled={isBusy}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <Select onValueChange={setSource} value={source} disabled={isBusy}>
            <SelectTrigger className="w-full md:w-[240px] h-12 text-base">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              {currentScriptures.map(scripture => (
                <SelectItem key={scripture} value={scripture}>{scripture}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant={isRecording ? 'destructive' : 'outline'}
            size="icon"
            className="h-12 w-12 shrink-0"
            onClick={handleMicClick}
            disabled={isBusy}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isTranscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : (isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />)}
          </Button>
          <Button
            type="submit"
            className="h-12 px-6"
            disabled={isBusy}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
          </Button>
        </div>
      </div>
      <TooltipProvider delayDuration={200}>
        <RadioGroup
          value={mode}
          onValueChange={(value) => setMode(value as SearchMode)}
          className="flex items-center justify-center gap-4 md:gap-6 py-2 flex-wrap"
          disabled={isBusy}
        >
          {renderModeOption('Universalist', 'mode-universalist', Globe, 'Universalist')}
          {renderModeOption('Spiritual', 'mode-spiritual', Sparkles, 'Spiritual')}
          {renderModeOption('Religious', 'mode-religious', Book, 'Religious')}
          {renderModeOption('Non-Religious', 'mode-non-religious', User, 'Non-Religious')}
        </RadioGroup>
      </TooltipProvider>
    </form>
  );
});

VerseSearchForm.displayName = 'VerseSearchForm';
