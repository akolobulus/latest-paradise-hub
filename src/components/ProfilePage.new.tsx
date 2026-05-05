import { useState, useEffect, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Edit2, X, Upload, ChevronDown, Plus, 
  Linkedin, Facebook, Twitter, Youtube, Instagram,
  Globe, Heart, Check, ArrowLeft, Bell, Grid, FileText, Trophy
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import BrandLogo from "./BrandLogo";
import PageFooter from "./PageFooter";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";
import { calculateProfileCompletion, getProfileSections, ProfileData } from "@/src/lib/profileCompletion";

interface ProfilePageProps {
  onBack: () => void;
  onProfileUpdate?: (profile: ProfileData) => void;
  onViewCourseByTitle?: (courseTitle: string) => void;
}

type Tab = "Personal Information" | "Education Info" | "Work Info";

export default function ProfilePage({ onBack, onProfileUpdate, onViewCourseByTitle }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Personal Information");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // Supabase State
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  // Cascading Location States
  const allCountries = Country.getAllCountries();
  const [originStates, setOriginStates] = useState<any[]>([]);
  const [originCities, setOriginCities] = useState<any[]>([]);
  const [residenceStates, setResidenceStates] = useState<any[]>([]);
  const [residenceCities, setResidenceCities] = useState<any[]>([]);

  // Internal codes needed by country-state-city
  const [locCodes, setLocCodes] = useState({
    originCountryCode: "",
    originStateCode: "",
    residenceCountryCode: "",
    residenceStateCode: ""
  });
  
  // Unified Form State
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    about_me: "",
    languages: [] as string[],
    phone_number: "",
    whatsapp_number: "",
    interests: [] as string[],
    country_of_origin: "",
    state_of_origin: "",
    city_of_origin: "",
    country_of_residence: "",
    state_of_residence: "",
    city_of_residence: "",
    education_level: "",
    institution: "",
    course_of_study: "",
    year_of_graduation: "",
    graduation_class: "",
    nysc_completed: "",
    professional_experience: "",
    employment_status: "",
    skill_level: "",
    english_proficiency: "",
    social_profiles: { linkedin: "", facebook: "", twitter: "", youtube: "", instagram: "", tiktok: "" }
  });

  const tabs: Tab[] = ["Personal Information", "Education Info", "Work Info"];

  // --- Strict Local Profile Completion Tracker ---
  const getProfileCompletionData = (p: any) => {
    if (!p) return { percentage: 0, sections: [] };

    // 1. Check if AT LEAST ONE social profile is filled out
    const hasAtLeastOneSocial = p.social_profiles 
      ? Object.values(p.social_profiles).some(link => Boolean(link)) 
      : false;

    // 2. Personal Info is strictly tied to personal/location/social fields
    const isPersonalDone = Boolean(
      p.full_name && p.gender && p.phone_number && 
      p.country_of_origin && p.state_of_origin && 
      p.country_of_residence && p.state_of_residence && 
      p.about_me && p.interests && p.interests.length > 0 &&
      hasAtLeastOneSocial
    );

    // 3. Education Info is strictly tied to the education modal fields
    const isEducationDone = Boolean(
      p.education_level && p.institution && p.course_of_study && 
      p.year_of_graduation && p.graduation_class && p.nysc_completed
    );

    // 4. Work Info is strictly tied to the professional modal fields
    const isWorkDone = Boolean(
      p.employment_status && p.skill_level && p.english_proficiency && p.professional_experience
    );

    let completedCount = 0;
    if (isPersonalDone) completedCount++;
    if (isEducationDone) completedCount++;
    if (isWorkDone) completedCount++;

    return {
      percentage: Math.round((completedCount / 3) * 100),
      sections: [
        { label: "Personal Info", completed: isPersonalDone },
        { label: "Education Info", completed: isEducationDone },
        { label: "Work Info", completed: isWorkDone }
      ]
    };
  };

  const { percentage: profileCompletion, sections: profileSections } = getProfileCompletionData(profile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        const names = (data.full_name || "").split(" ");
        setEditForm({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          gender: data.gender || "",
          about_me: data.about_me || "",
          languages: data.languages || [],
          phone_number: data.phone_number || "",
          whatsapp_number: data.whatsapp_number || "",
          interests: data.interests || [],
          country_of_origin: data.country_of_origin || "",
          state_of_origin: data.state_of_origin || "",
          city_of_origin: data.city_of_origin || "",
          country_of_residence: data.country_of_residence || "",
          state_of_residence: data.state_of_residence || "",
          city_of_residence: data.city_of_residence || "",
          education_level: data.education_level || "",
          institution: data.institution || "",
          course_of_study: data.course_of_study || "",
          year_of_graduation: data.year_of_graduation || "",
          graduation_class: data.graduation_class || "",
          nysc_completed: data.nysc_completed || "",
          professional_experience: data.professional_experience || "",
          employment_status: data.employment_status || "",
          skill_level: data.skill_level || "",
          english_proficiency: data.english_proficiency || "",
          social_profiles: data.social_profiles || { linkedin: "", facebook: "", twitter: "", youtube: "", instagram: "", tiktok: "" }
        });

        // Pre-fill location dropdowns if data exists
        if (data.country_of_origin) {
          const c = Country.getAllCountries().find(c => c.name === data.country_of_origin);
          if (c) {
            setLocCodes(prev => ({...prev, originCountryCode: c.isoCode}));
            setOriginStates(State.getStatesOfCountry(c.isoCode));
            if (data.state_of_origin) {
              const s = State.getStatesOfCountry(c.isoCode).find(s => s.name === data.state_of_origin);
              if (s) {
                setLocCodes(prev => ({...prev, originStateCode: s.isoCode}));
                setOriginCities(City.getCitiesOfState(c.isoCode, s.isoCode));
              }
            }
          }
        }

        if (data.country_of_residence) {
          const c = Country.getAllCountries().find(c => c.name === data.country_of_residence);
          if (c) {
            setLocCodes(prev => ({...prev, residenceCountryCode: c.isoCode}));
            setResidenceStates(State.getStatesOfCountry(c.isoCode));
            if (data.state_of_residence) {
              const s = State.getStatesOfCountry(c.isoCode).find(s => s.name === data.state_of_residence);
              if (s) {
                setLocCodes(prev => ({...prev, residenceStateCode: s.isoCode}));
                setResidenceCities(City.getCitiesOfState(c.isoCode, s.isoCode));
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Dynamic Location Handlers ---
  const handleOriginCountryChange = (isoCode: string, name: string) => {
    setLocCodes(prev => ({ ...prev, originCountryCode: isoCode, originStateCode: "" }));
    setEditForm(prev => ({ ...prev, country_of_origin: name, state_of_origin: "", city_of_origin: "" }));
    setOriginStates(State.getStatesOfCountry(isoCode));
    setOriginCities([]);
  };

  const handleOriginStateChange = (isoCode: string, name: string) => {
    setLocCodes(prev => ({ ...prev, originStateCode: isoCode }));
    setEditForm(prev => ({ ...prev, state_of_origin: name, city_of_origin: "" }));
    setOriginCities(City.getCitiesOfState(locCodes.originCountryCode, isoCode));
  };

  const handleResidenceCountryChange = (isoCode: string, name: string) => {
    setLocCodes(prev => ({ ...prev, residenceCountryCode: isoCode, residenceStateCode: "" }));
    setEditForm(prev => ({ ...prev, country_of_residence: name, state_of_residence: "", city_of_residence: "" }));
    setResidenceStates(State.getStatesOfCountry(isoCode));
    setResidenceCities([]);
  };

  const handleResidenceStateChange = (isoCode: string, name: string) => {
    setLocCodes(prev => ({ ...prev, residenceStateCode: isoCode }));
    setEditForm(prev => ({ ...prev, state_of_residence: name, city_of_residence: "" }));
    setResidenceCities(City.getCitiesOfState(locCodes.residenceCountryCode, isoCode));
  };

  // --- Profile Saving ---
  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    
    try {
      // 1. Calculate completion BEFORE saving
      const currentCompletion = getProfileCompletionData(profile).percentage;

      const fullName = `${editForm.firstName} ${editForm.lastName}`.trim();
      const updateData = {
        full_name: fullName,
        gender: editForm.gender,
        about_me: editForm.about_me,
        languages: editForm.languages.filter(Boolean),
        phone_number: editForm.phone_number,
        whatsapp_number: editForm.whatsapp_number,
        interests: editForm.interests.filter(Boolean),
        country_of_origin: editForm.country_of_origin,
        state_of_origin: editForm.state_of_origin,
        city_of_origin: editForm.city_of_origin,
        country_of_residence: editForm.country_of_residence,
        state_of_residence: editForm.state_of_residence,
        city_of_residence: editForm.city_of_residence,
        education_level: editForm.education_level,
        institution: editForm.institution,
        course_of_study: editForm.course_of_study,
        year_of_graduation: editForm.year_of_graduation,
        graduation_class: editForm.graduation_class,
        nysc_completed: editForm.nysc_completed,
        professional_experience: editForm.professional_experience,
        employment_status: editForm.employment_status,
        skill_level: editForm.skill_level,
        english_proficiency: editForm.english_proficiency,
        social_profiles: editForm.social_profiles,
      };

      const { error } = await supabase.from('profiles').update(updateData).eq('id', profile.id);
      if (error) throw new Error(error.message);

      const updatedProfile = { ...profile, ...updateData };

      // 2. Calculate completion AFTER saving the new data
      const newCompletion = getProfileCompletionData(updatedProfile).percentage;

      // 3. THE REWARD TRIGGER: If they hit 100% for the first time, give them 20 points!
      if (newCompletion === 100 && currentCompletion < 100) {
        const { error: rpcError } = await supabase.rpc('increment_points', { amount: 20, row_id: profile.id });
        if (rpcError) {
          console.error("RPC Error:", rpcError);
          throw new Error(`Failed to award points: ${rpcError.message}`);
        }
        updatedProfile.points = (updatedProfile.points || 0) + 20;
        alert("🎉 Congratulations! You earned 20 Harvest Points for completing your profile!");
      }

      setProfile(updatedProfile);
      setEditingSection(null);
      if (onProfileUpdate) onProfileUpdate(updatedProfile as ProfileData);
      
    } catch (error: any) {
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>, bucket: 'avatars' | 'documents', isAvatar: boolean) => {
    try {
      if (isAvatar) setIsUploading(true); else setIsUploadingCV(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error('No file selected.');

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      
      const updateField = isAvatar ? { avatar_url: publicUrl } : { cv_url: publicUrl };
      const { error: updateError } = await supabase.from('profiles').update(updateField).eq('id', profile?.id);
      if (updateError) throw updateError;

      setProfile((prev: any) => {
        const updated = prev ? { ...prev, ...updateField } : null;
        if (updated && onProfileUpdate) onProfileUpdate(updated);
        return updated;
      });
      
    } catch (error: any) {
      alert(error.message || "Failed to upload file.");
    } finally {
      if (isAvatar) setIsUploading(false); else setIsUploadingCV(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // --- Modals ---
  const renderModal = () => {
    if (!editingSection) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingSection(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-ink">{editingSection}</h3>
                <p className="text-sm text-gray-500">Complete your information</p>
              </div>
              <button onClick={() => setEditingSection(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              
              {editingSection === "Personal Info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">First Name*</label><input type="text" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" /></div>
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">Last Name*</label><input type="text" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Gender*</label>
                    <select value={editForm.gender} onChange={(e) => setEditForm({...editForm, gender: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white">
                      <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
              )}

              {editingSection === "Contact & Location" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">Primary Phone*</label><input type="text" value={editForm.phone_number} onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})} placeholder="+234..." className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" /></div>
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">WhatsApp Number*</label><input type="text" value={editForm.whatsapp_number} onChange={(e) => setEditForm({...editForm, whatsapp_number: e.target.value})} placeholder="+234..." className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" /></div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-primary border-b pb-2">Origin Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select onChange={(e) => handleOriginCountryChange(e.target.options[e.target.selectedIndex].dataset.iso || "", e.target.value)} value={editForm.country_of_origin} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm">
                        <option value="">Country</option>
                        {allCountries.map(c => <option key={c.isoCode} data-iso={c.isoCode} value={c.name}>{c.name}</option>)}
                      </select>
                      <select onChange={(e) => handleOriginStateChange(e.target.options[e.target.selectedIndex].dataset.iso || "", e.target.value)} value={editForm.state_of_origin} disabled={!editForm.country_of_origin} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm disabled:bg-gray-50">
                        <option value="">State</option>
                        {originStates.map(s => <option key={s.isoCode} data-iso={s.isoCode} value={s.name}>{s.name}</option>)}
                      </select>
                      <select onChange={(e) => setEditForm({...editForm, city_of_origin: e.target.value})} value={editForm.city_of_origin} disabled={!editForm.state_of_origin} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm disabled:bg-gray-50">
                        <option value="">City / LGA</option>
                        {originCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-primary border-b pb-2">Residence Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select onChange={(e) => handleResidenceCountryChange(e.target.options[e.target.selectedIndex].dataset.iso || "", e.target.value)} value={editForm.country_of_residence} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm">
                        <option value="">Country</option>
                        {allCountries.map(c => <option key={c.isoCode} data-iso={c.isoCode} value={c.name}>{c.name}</option>)}
                      </select>
                      <select onChange={(e) => handleResidenceStateChange(e.target.options[e.target.selectedIndex].dataset.iso || "", e.target.value)} value={editForm.state_of_residence} disabled={!editForm.country_of_residence} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm disabled:bg-gray-50">
                        <option value="">State</option>
                        {residenceStates.map(s => <option key={s.isoCode} data-iso={s.isoCode} value={s.name}>{s.name}</option>)}
                      </select>
                      <select onChange={(e) => setEditForm({...editForm, city_of_residence: e.target.value})} value={editForm.city_of_residence} disabled={!editForm.state_of_residence} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm disabled:bg-gray-50">
                        <option value="">City / LGA</option>
                        {residenceCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {editingSection === "About" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ink">Tell us something about you</label>
                  <textarea value={editForm.about_me} onChange={(e) => setEditForm({...editForm, about_me: e.target.value})} className="w-full h-40 px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
                </div>
              )}

              {editingSection === "Social Profile" && (
                <div className="space-y-4">
                  {["linkedin", "facebook", "twitter", "youtube", "instagram", "tiktok"].map((key) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm font-bold text-ink capitalize">{key}</label>
                      <input type="text" value={editForm.social_profiles[key as keyof typeof editForm.social_profiles] || ""} onChange={(e) => setEditForm({...editForm, social_profiles: {...editForm.social_profiles, [key]: e.target.value}})} placeholder={`https://${key}.com/`} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                    </div>
                  ))}
                </div>
              )}

              {editingSection === "Education Info" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Education Level</label>
                    <select value={editForm.education_level} onChange={(e) => setEditForm({...editForm, education_level: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                      <option value="">Select Education</option>
                      <option>Primary school leaving certificate</option>
                      <option>Senior Secondary Certificate Exam (SSCE)</option>
                      <option>Ordinary National Diploma (OND)</option>
                      <option>Higher National Diploma (HND)</option>
                      <option>Bachelor's Degree</option>
                      <option>Master's Degree</option>
                      <option>Doctor of philosophy (PhD)</option>
                      <option>No Education</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">Institution</label><input type="text" value={editForm.institution} onChange={(e) => setEditForm({...editForm, institution: e.target.value})} placeholder="e.g. University of Lagos" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" /></div>
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">Course of Study</label><input type="text" value={editForm.course_of_study} onChange={(e) => setEditForm({...editForm, course_of_study: e.target.value})} placeholder="e.g. Business Administration" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Year of Graduation</label>
                      <select value={editForm.year_of_graduation} onChange={(e) => setEditForm({...editForm, year_of_graduation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                        <option value="">Select Year</option>
                        {Array.from({length: 46}, (_, i) => 2025 - i).map(year => <option key={year} value={year}>{year}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Graduation Class</label>
                      <select value={editForm.graduation_class} onChange={(e) => setEditForm({...editForm, graduation_class: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                        <option value="">Select Class</option><option>First Class</option><option>Second Class (Upper Division)</option><option>Second Class (Lower Division)</option><option>Third Class</option><option>Pass</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">NYSC Status</label>
                    <select value={editForm.nysc_completed} onChange={(e) => setEditForm({...editForm, nysc_completed: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                      <option value="">Select Option</option><option>Yes</option><option>No</option><option>Exempted</option>
                    </select>
                  </div>
                </div>
              )}

              {editingSection === "Work Info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">Employment Status</label><select value={editForm.employment_status} onChange={(e) => setEditForm({...editForm, employment_status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none"><option value="">Select</option><option>Employed</option><option>Unemployed</option><option>Self-Employed</option><option>Student</option></select></div>
                    <div className="space-y-2"><label className="text-sm font-bold text-ink">Skill Level</label><select value={editForm.skill_level} onChange={(e) => setEditForm({...editForm, skill_level: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none"><option value="">Select</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                  </div>
                  <div className="space-y-2"><label className="text-sm font-bold text-ink">English Proficiency</label><select value={editForm.english_proficiency} onChange={(e) => setEditForm({...editForm, english_proficiency: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none"><option value="">Select</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-ink">Professional Experience</label><textarea value={editForm.professional_experience} onChange={(e) => setEditForm({...editForm, professional_experience: e.target.value})} placeholder="Describe your experience..." className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" /></div>
                </div>
              )}

            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-4 shrink-0 bg-gray-50">
              <button onClick={() => setEditingSection(null)} className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors">Cancel</button>
              <button onClick={handleSaveProfile} disabled={isSaving} className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-[50]">
        <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
          <span className="font-display font-bold text-xl tracking-tight text-ink hidden sm:block">
            Paradise <span className="text-primary">Hub</span>
          </span>
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 hover:bg-accent/15 transition-colors">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">H</div>
            <span className="font-bold text-sm tracking-tight">{profile?.points?.toLocaleString() || 0} pts</span>
          </button>
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
            <Bell size={20} />
          </button>
          <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden border border-gray-200">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : getInitials(profile?.full_name)}
          </button>
        </div>
      </nav>

      {/* Header Banner */}
      <div className="relative h-48 md:h-80 bg-gradient-to-r from-primary via-primary-light to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </div>
        <div className="max-w-[1400px] mx-auto h-full flex items-center px-6 relative">
          <button onClick={onBack} className="absolute top-8 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">
            <span className="text-yellow-400">Showcase</span> your Potential Here
          </h1>
        </div>
      </div>

      {/* Profile Info Bar */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 pb-8">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-xl">
              <label className={cn("w-full h-full rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors", isUploading && "opacity-50 pointer-events-none")}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <><Camera size={32} /><span className="text-[10px] font-bold mt-1">Add Photo</span></>}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatars', true)} className="hidden" />
              </label>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight uppercase">
              {isLoading ? "LOADING..." : profile?.full_name || "LEARNER"}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("pb-4 text-sm font-bold transition-all relative whitespace-nowrap", activeTab === tab ? "text-primary" : "text-gray-400 hover:text-ink")}>
              {tab}
              {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 py-8">
          
          {/* Sidebar (Completion Card) */}
          <div className="order-first lg:order-last space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-ink mb-6">Profile Completion</h3>
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-gray-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle className="text-primary transition-all duration-1000" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * profileCompletion) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl md:text-2xl font-bold text-ink">{profileCompletion}%</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {profileSections.map((section) => (
                    <div key={section.label} className="flex items-center gap-3">
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0", section.completed ? "bg-primary border-primary" : "border-gray-400")}>
                        {section.completed && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-600 truncate">{section.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {profileCompletion === 100 ? (
                <div className="mt-6 bg-green-50 text-green-700 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-green-100">
                  <Trophy size={16} /> Profile Complete (20 Pts Awarded!)
                </div>
              ) : (
                <div className="mt-6 text-xs text-gray-500 text-center">Complete all sections to earn 20 Harvest Points!</div>
              )}
            </div>
          </div>

          {/* MAIN TAB CONTENT */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* PERSONAL INFO TAB */}
            {activeTab === "Personal Information" && (
              <>
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Personal Details</h3>
                    <button onClick={() => setEditingSection("Personal Info")} className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div><p className="text-gray-400 mb-1">Full Name</p><p className="font-bold text-ink">{profile?.full_name || '—'}</p></div>
                    <div><p className="text-gray-400 mb-1">Gender</p><p className="font-bold text-ink">{profile?.gender || '—'}</p></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Contact & Location</h3>
                    <button onClick={() => setEditingSection("Contact & Location")} className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div><p className="text-gray-400 mb-1">Phone</p><p className="font-bold text-ink">{profile?.phone_number || '—'}</p></div>
                    <div><p className="text-gray-400 mb-1">WhatsApp</p><p className="font-bold text-ink">{profile?.whatsapp_number || '—'}</p></div>
                    <div className="md:col-span-2"><p className="text-gray-400 mb-1">Origin</p><p className="font-bold text-ink">{[profile?.city_of_origin, profile?.state_of_origin, profile?.country_of_origin].filter(Boolean).join(", ") || '—'}</p></div>
                    <div className="md:col-span-2"><p className="text-gray-400 mb-1">Residence</p><p className="font-bold text-ink">{[profile?.city_of_residence, profile?.state_of_residence, profile?.country_of_residence].filter(Boolean).join(", ") || '—'}</p></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">About Me</h3>
                    <button onClick={() => setEditingSection("About")} className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                  </div>
                  <p className="font-bold text-ink whitespace-pre-wrap text-sm">{profile?.about_me || 'No description provided.'}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Interests</h3>
                    <button onClick={() => setEditingSection("Interests")} className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                  </div>
                  {profile?.interests && profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-ink">No interests added</p>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Social Profiles</h3>
                    <button onClick={() => setEditingSection("Social Profile")} className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                  </div>
                  {profile?.social_profiles && Object.values(profile.social_profiles).some(val => val) ? (
                    <div className="space-y-3">
                      {Object.entries(profile.social_profiles).map(([platform, link]) => {
                        if (!link) return null;
                        return (
                          <div key={platform} className="flex items-center gap-2">
                            <span className="capitalize text-xs font-bold text-ink">{platform}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <a href={link as string} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm truncate">Link</a>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-ink">No social links added</p>
                  )}
                </div>
              </>
            )}

            {/* EDUCATION INFO TAB */}
            {activeTab === "Education Info" && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-ink">Education & Academics</h3>
                  <button onClick={() => setEditingSection("Education Info")} className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div><p className="text-gray-400 mb-1">Level</p><p className="font-bold text-ink">{profile?.education_level || '—'}</p></div>
                  <div><p className="text-gray-400 mb-1">Institution</p><p className="font-bold text-ink">{profile?.institution || '—'}</p></div>
                  <div><p className="text-gray-400 mb-1">Course of Study</p><p className="font-bold text-ink">{profile?.course_of_study || '—'}</p></div>
                  <div><p className="text-gray-400 mb-1">Graduation Year</p><p className="font-bold text-ink">{profile?.year_of_graduation || '—'}</p></div>
                  <div><p className="text-gray-400 mb-1">Class</p><p className="font-bold text-ink">{profile?.graduation_class || '—'}</p></div>
                  <div><p className="text-gray-400 mb-1">NYSC Status</p><p className="font-bold text-ink">{profile?.nysc_completed || '—'}</p></div>
                </div>
              </div>
            )}

            {/* WORK INFO TAB */}
            {activeTab === "Work Info" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Professional Info</h3>
                    <button onClick={() => setEditingSection("Work Info")} className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div><p className="text-gray-400 mb-1">Employment Status</p><p className="font-bold text-ink">{profile?.employment_status || '—'}</p></div>
                    <div><p className="text-gray-400 mb-1">Skill Level</p><p className="font-bold text-ink">{profile?.skill_level || '—'}</p></div>
                    <div><p className="text-gray-400 mb-1">English Proficiency</p><p className="font-bold text-ink">{profile?.english_proficiency || '—'}</p></div>
                    <div className="md:col-span-2"><p className="text-gray-400 mb-1">Experience</p><p className="font-bold text-ink whitespace-pre-wrap">{profile?.professional_experience || '—'}</p></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-ink mb-4">Resume / CV</h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-xl p-4 bg-gray-50 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center"><FileText size={20} /></div>
                      <div>
                        <p className="text-sm font-bold text-ink">Your Uploaded CV</p>
                        <p className="text-xs text-gray-500">{profile?.cv_url ? "Document saved" : "No CV uploaded yet"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {profile?.cv_url && <a href={profile.cv_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline px-3 py-2">View</a>}
                      <label className={cn("px-4 py-2 text-xs font-bold text-white bg-ink rounded-lg transition-colors cursor-pointer w-full sm:w-auto text-center", isUploadingCV && "opacity-50 pointer-events-none")}>
                        {isUploadingCV ? "Uploading..." : "Upload New"}
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'avatars', false)} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <PageFooter onViewCourseByTitle={onViewCourseByTitle} />
      {renderModal()}
    </div>
  );
}
