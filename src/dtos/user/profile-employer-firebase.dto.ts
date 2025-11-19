export type ProfileEmployerFireBaseDto = {
  id?: string;
  // avatarUrl?: string;
  // savedJobs?: string[];
  createdAt: Date;
  companyProfile?: {
    description?: string;
    website?: string;
    address?: string;
    industry?: string;
  };
};
