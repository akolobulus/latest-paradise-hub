// Profile completion tracking utility
import { supabase } from './supabase';

export interface ProfileData {
  id?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  about_me?: string | null;
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
  education_level?: string | null;
  institution?: string | null;
  course_of_study?: string | null;
  year_of_graduation?: string | null;
  graduation_class?: string | null;
  nysc_completed?: string | null;
  employment_status?: string | null;
  skill_level?: string | null;
  english_proficiency?: string | null;
  professional_experience?: string | null;
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

  const hasAtLeastOneSocial = profile.social_profiles
    ? Object.values(profile.social_profiles).some(link => Boolean(link))
    : false;

  return [
    {
      label: "Personal Info",
      completed: !!(profile.full_name && profile.gender && profile.phone_number && profile.about_me && profile.interests && profile.interests.length > 0 && hasAtLeastOneSocial),
      category: 'personal',
    },
    {
      label: "Education Info",
      completed: !!(profile.education_level && profile.institution && profile.course_of_study && profile.year_of_graduation && profile.graduation_class && profile.nysc_completed),
      category: 'education',
    },
    {
      label: "Work Info",
      completed: !!(profile.employment_status && profile.skill_level && profile.english_proficiency && profile.professional_experience),
      category: 'work',
    },
    {
      label: "Demographic Info",
      completed: !!(profile.country_of_origin && profile.state_of_origin && profile.country_of_residence && profile.state_of_residence),
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

// Fetch current user's points from database
export async function getCurrentUserPoints(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single();

    if (error || !data) return 0;
    return data.points || 0;
  } catch (error) {
    console.error('Error fetching user points:', error);
    return 0;
  }
}
