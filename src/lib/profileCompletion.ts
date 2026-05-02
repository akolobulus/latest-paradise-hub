// Profile completion tracking utility

export interface ProfileData {
  id?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  about_me?: string | null;
  title?: string | null;
  gender?: string | null;
  languages?: string[] | null;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  social_profiles?: Record<string, string | null> | null;
  interests?: string[] | null;
  country_of_origin?: string | null;
  state_of_origin?: string | null;
  city_of_origin?: string | null;
  country_of_residence?: string | null;
  state_of_residence?: string | null;
  city_of_residence?: string | null;
  points?: number | null;
}

export interface ProfileSection {
  label: string;
  completed: boolean;
  category: 'personal' | 'education' | 'work' | 'demographic';
}

// Calculate which profile sections are completed
export function getProfileSections(profile: ProfileData | null): ProfileSection[] {
  if (!profile) {
    return [
      { label: "Personal Info", completed: false, category: 'personal' },
      { label: "Education Info", completed: false, category: 'education' },
      { label: "Work Info", completed: false, category: 'work' },
      { label: "Demographic Info", completed: false, category: 'demographic' },
    ];
  }

  return [
    {
      label: "Personal Info",
      completed: !!(profile.full_name && profile.avatar_url && profile.title),
      category: 'personal',
    },
    {
      label: "Education Info",
      completed: !!(profile.about_me && profile.languages && profile.languages.length > 0),
      category: 'education',
    },
    {
      label: "Work Info",
      completed: !!(profile.phone_number && profile.whatsapp_number && (profile.social_profiles && Object.values(profile.social_profiles).some(v => v))),
      category: 'work',
    },
    {
      label: "Demographic Info",
      completed: !!(profile.country_of_residence && profile.state_of_residence && profile.city_of_residence && profile.country_of_origin && profile.state_of_origin && profile.city_of_origin),
      category: 'demographic',
    },
  ];
}

// Calculate overall profile completion percentage
export function calculateProfileCompletion(profile: ProfileData | null): number {
  const sections = getProfileSections(profile);
  const completedSections = sections.filter(s => s.completed).length;
  return Math.round((completedSections / sections.length) * 100);
}

// Get detailed completion metrics
export function getProfileCompletionDetails(profile: ProfileData | null) {
  const sections = getProfileSections(profile);
  const completedSections = sections.filter(s => s.completed).length;
  const totalSections = sections.length;
  const percentage = calculateProfileCompletion(profile);

  return {
    percentage,
    completedSections,
    totalSections,
    sections,
    isComplete: percentage === 100,
  };
}
