export interface UpdateDataProps {
    profile: {
      username: string;
      gender?: string;
      birthdate?: string;
      location?: string;
      website?: string;
    };
    onSuccess?: () => void;
  }