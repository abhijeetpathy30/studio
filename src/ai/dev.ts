import { config } from 'dotenv';
config();

import '@/ai/flows/perform-search.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/get-random-fact.ts';
import '@/ai/flows/find-specific-parallels.ts';
