import { create } from 'zustand';
import type { DestinationType, Gender, TravelStyle } from '../api/types';

export interface PreviousTripDraft {
  mediaId: string;
  photoUrl?: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  description?: string;
}

interface OnboardingWizardState {
  photoMediaId?: string;
  photoUrl?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bio?: string;
  destinationTypes: DestinationType[];
  travelStyles: TravelStyle[];
  previousTrips: PreviousTripDraft[];
  setProfileFields: (fields: Partial<OnboardingWizardState>) => void;
  toggleDestinationType: (value: DestinationType) => void;
  toggleTravelStyle: (value: TravelStyle) => void;
  addTrip: (trip: PreviousTripDraft) => void;
  removeTrip: (index: number) => void;
  reset: () => void;
}

const initialState = {
  photoMediaId: undefined,
  photoUrl: undefined,
  gender: undefined,
  dateOfBirth: undefined,
  bio: undefined,
  destinationTypes: [] as DestinationType[],
  travelStyles: [] as TravelStyle[],
  previousTrips: [] as PreviousTripDraft[],
};

export const useOnboardingWizardStore = create<OnboardingWizardState>((set) => ({
  ...initialState,

  setProfileFields: (fields) => set(fields),

  toggleDestinationType: (value) =>
    set((s) => ({
      destinationTypes: s.destinationTypes.includes(value)
        ? s.destinationTypes.filter((v) => v !== value)
        : [...s.destinationTypes, value],
    })),

  toggleTravelStyle: (value) =>
    set((s) => ({
      travelStyles: s.travelStyles.includes(value)
        ? s.travelStyles.filter((v) => v !== value)
        : [...s.travelStyles, value],
    })),

  addTrip: (trip) => set((s) => ({ previousTrips: [...s.previousTrips, trip] })),

  removeTrip: (index) =>
    set((s) => ({ previousTrips: s.previousTrips.filter((_, i) => i !== index) })),

  reset: () => set(initialState),
}));
