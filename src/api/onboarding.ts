import { apiFetch } from './client';
import type { DestinationType, Gender, TravelStyle } from './types';

export interface PreviousTripInput {
  mediaId: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  description?: string;
}

export interface ProfileSetupInput {
  photoMediaId?: string;
  destinationTypes: DestinationType[];
  travelStyles: TravelStyle[];
  gender?: Gender;
  dateOfBirth?: string;
  bio?: string;
  previousTrips?: PreviousTripInput[];
  walletPaymentMethodId?: string;
}

export function completeProfileSetup(input: ProfileSetupInput, accessToken: string) {
  return apiFetch<{ userId: string; badge: string }>('/me/profile-setup', {
    method: 'POST',
    body: input,
    accessToken,
  });
}
