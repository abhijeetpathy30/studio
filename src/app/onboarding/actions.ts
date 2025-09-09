'use server';

import { UserProfile, UserProfileSchema } from "@/lib/types";
import { z } from "zod";
import { db } from '@/lib/firebase';

const CreateUserProfileSchema = UserProfileSchema.partial({ createdAt: true });

export async function createUserProfile(userId: string, profile: UserProfile): Promise<{ success: boolean; error?: string }> {
  const validatedProfile = CreateUserProfileSchema.safeParse(profile);

  if (!validatedProfile.success) {
    console.error("Invalid user profile data:", validatedProfile.error.flatten());
    return { success: false, error: "Invalid profile data provided." };
  }

  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      ...validatedProfile.data,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    return { success: false, error: 'Failed to save profile to the database.' };
  }
}
