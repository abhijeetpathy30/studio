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
import type { SearchMode } from '@/lib/types';

interface VerseSearchFormProps {
  onSearch: (query: string, source: string, mode: SearchMode) => void;
  isLoading: boolean;
}

export interface VerseSearchFormRef {
  reset: () => void;
  setQuery: (query: string) => void;
}

export const VerseSearchForm = forwardRef<VerseSearchFormRef, VerseSearchFormProps>(({ onSearch, isLoading }, ref) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('Religious');
  const [currentScriptures, setCurrentScriptures] = useState(supportedScriptures.Religious);
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
      setMode('Religious');
      const defaultScriptures = supportedScriptures['Religious'];
      setCurrentScriptures(defaultScriptures);
      setSource(defaultScriptures[0]);
    },
    setQuery: (newQuery: string) => setQuery(newQuery),
  }));
  
  const isBusy = isLoading || isTranscribing;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRecording ? "Recording... speak now" : isTranscribing ? "Transcribing..." : "Search verse or topic (e.g., 'love', 'Romans 12:21')"}
            className="w-full pl-11 h-12 text-base rounded-full"
            disabled={isBusy}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Select onValueChange={setSource} value={source} disabled={isBusy}>
                <SelectTrigger className="w-full md:w-[240px] h-12 rounded-full text-base">
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
                className="h-12 w-12 rounded-full"
                onClick={handleMicClick}
                disabled={isBusy}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                {isTranscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : (isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />)}
            </Button>
            <Button
                type="submit"
                className="h-12 rounded-full px-6"
                disabled={isBusy}
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
            </Button>
        </div>
      </div>
       <RadioGroup
        value={mode}
        onValueChange={(value) => setMode(value as SearchMode)}
        className="flex items-center justify-center gap-2 md:gap-4 py-2 flex-wrap"
        disabled={isBusy}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Religious" id="mode-religious" />
          <Label htmlFor="mode-religious" className="flex items-center gap-2 cursor-pointer text-base">
            <Book className="h-5 w-5" />
            Religious
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Spiritual" id="mode-spiritual" />
          <Label htmlFor="mode-spiritual" className="flex items-center gap-2 cursor-pointer text-base">
            <Sparkles className="h-5 w-5" />
            Spiritual
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Non-Religious" id="mode-non-religious" />
          <Label htmlFor="mode-non-religious" className="flex items-center gap-2 cursor-pointer text-base">
            <User className="h-5 w-5" />
            Non-Religious
          </Label>
        </div>
         <div className="flex items-center space-x-2">
          <RadioGroupItem value="Universalist" id="mode-universalist" />
          <Label htmlFor="mode-universalist" className="flex items-center gap-2 cursor-pointer text-base">
            <Globe className="h-5 w-5" />
            Universalist
          </Label>
        </div>
      </RadioGroup>
    </form>
  );
});

VerseSearchForm.displayName = 'VerseSearchForm';
