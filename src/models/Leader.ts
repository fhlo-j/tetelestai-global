
export interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  phone?: string;
  image: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  isSeniorPastor?: boolean;
  orderRank: number; // Lower numbers appear first
  education?: string[];
  ministryFocus?: string[];
  familyInfo?: string;
  visionStatement?: string;
}
