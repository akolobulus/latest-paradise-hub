import { useState, useEffect, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  Edit2, 
  X, 
  Upload, 
  ChevronDown, 
  Plus, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Youtube, 
  Github,
  Globe,
  Heart,
  Check,
  ArrowLeft,
  Bell,
  Grid
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";
import { calculateProfileCompletion, getProfileSections, ProfileData } from "@/src/lib/profileCompletion";

interface ProfilePageProps {
  onBack: () => void;
  onProfileUpdate?: (profile: ProfileData) => void;
}

type Tab = "Personal Information" | "Education Info" | "Work Info" | "Demographic Info";

export default function ProfilePage({ onBack, onProfileUpdate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Personal Information");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // Supabase State
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Mock notifications
  
  // Form state for all fields
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    title: "",
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
    social_profiles: {
      linkedin: "",
      facebook: "",
      twitter: "",
      youtube: "",
      github: "",
      tiktok: ""
    }
  });

  const tabs: Tab[] = ["Personal Information", "Education Info", "Work Info", "Demographic Info"];
  const profileCompletion = calculateProfileCompletion(profile);
  const profileSections = getProfileSections(profile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        // Initialize form with profile data
        const names = (data.full_name || "").split(" ");
        setEditForm({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          title: data.title || "",
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
          social_profiles: data.social_profiles || {
            linkedin: "",
            facebook: "",
            twitter: "",
            youtube: "",
            github: "",
            tiktok: ""
          }
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    
    try {
      const fullName = `${editForm.firstName} ${editForm.lastName}`.trim();
      const updateData = {
        full_name: fullName,
        title: editForm.title,
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
        social_profiles: editForm.social_profiles,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) {
        console.error("Supabase Update Error details:", error);
        throw new Error(error.message);
      }

      const updatedProfile = { ...profile, ...updateData } as ProfileData;
      setProfile(updatedProfile);
      setEditingSection(null);
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      alert(`Failed to update profile: ${error.message || 'Check database columns'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Path format: user_id/random_string.extension (Matches our RLS policy)
      const filePath = `${profile?.id}/${Math.random()}.${fileExt}`;

      // 1. Upload the file to the 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL for the newly uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update the user's profile with the new avatar_url
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      // 4. Update the local UI state and notify parent
      setProfile(prev => {
        const updatedProfile = prev ? { ...prev, avatar_url: publicUrl } : null;
        // Notify parent component that profile was updated
        if (updatedProfile && onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        return updatedProfile;
      });
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      alert(error.message || "Failed to upload avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to get initials from full name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const renderModal = () => {
    if (!editingSection) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingSection(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-ink">{editingSection}</h3>
                <p className="text-sm text-gray-500">Complete your information</p>
              </div>
              <button 
                onClick={() => setEditingSection(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {editingSection === "Basic Info" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    
                    {/* Display current Avatar */}
                    <div className="w-32 h-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold relative overflow-hidden shrink-0">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(profile?.full_name)
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* File Upload Box */}
                    <div className="flex-1 w-full">
                      <label className={cn(
                        "border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-colors group w-full",
                        isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 cursor-pointer"
                      )}>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Upload size={20} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-ink">
                            {isUploading ? "Uploading..." : <><span className="text-primary">Click to upload</span> or drag and drop</>}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">First Name*</label>
                      <input 
                        type="text" 
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Last Name*</label>
                      <input 
                        type="text" 
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Gender*</label>
                      <div className="relative">
                        <select 
                          value={editForm.gender}
                          onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option>Select the gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Title</label>
                    <input 
                      type="text" 
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      placeholder="What is your title?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {editingSection === "About" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Tell us something about you</label>
                    <textarea 
                      value={editForm.about_me}
                      onChange={(e) => setEditForm({...editForm, about_me: e.target.value})}
                      placeholder="Write a brief introduction to show on your profile..."
                      className="w-full h-40 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {editingSection === "Languages" && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">Add the languages you speak (comma-separated)</p>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={editForm.languages.join(", ")}
                      onChange={(e) => setEditForm({...editForm, languages: e.target.value.split(",").map(i => i.trim())})}
                      placeholder="e.g. English, French, Yoruba"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {editingSection === "Phone Number" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Phone Number*</label>
                    <div className="flex gap-2">
                      <div className="w-24 px-3 py-3 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
                        <span className="text-sm">🇳🇬</span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                        placeholder="+234"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">WhatsApp Number*</label>
                    <div className="flex gap-2">
                      <div className="w-24 px-3 py-3 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
                        <span className="text-sm">🇳🇬</span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={editForm.whatsapp_number}
                        onChange={(e) => setEditForm({...editForm, whatsapp_number: e.target.value})}
                        placeholder="+234"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors bg-primary">
                      <Check size={12} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">The same as primary phone number</p>
                      <p className="text-xs text-gray-400">Paradise Hub will use this number for ease of communication with you.</p>
                    </div>
                  </label>
                </div>
              )}

              {editingSection === "Social Profile" && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">Add your social links</p>
                  <div className="space-y-4">
                    {[
                      { key: "linkedin", label: "LinkedIn", icon: <Linkedin size={18} />, placeholder: "https://linkedin.com/in/" },
                      { key: "facebook", label: "Facebook", icon: <Facebook size={18} />, placeholder: "https://facebook.com/" },
                      { key: "twitter", label: "X (Twitter)", icon: <Twitter size={18} />, placeholder: "https://twitter.com/" },
                      { key: "youtube", label: "Youtube", icon: <Youtube size={18} />, placeholder: "https://youtube.com/" },
                      { key: "tiktok", label: "TikTok", icon: <Globe size={18} />, placeholder: "https://tiktok.com/" },
                      { key: "github", label: "GitHub", icon: <Github size={18} />, placeholder: "https://github.com/" },
                    ].map((social) => (
                      <div key={social.label} className="space-y-2">
                        <label className="text-sm font-bold text-ink">{social.label}</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {social.icon}
                          </div>
                          <input 
                            type="text" 
                            value={editForm.social_profiles[social.key as keyof typeof editForm.social_profiles] || ""}
                            onChange={(e) => setEditForm({
                              ...editForm, 
                              social_profiles: {
                                ...editForm.social_profiles, 
                                [social.key]: e.target.value
                              }
                            })}
                            placeholder={social.placeholder}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingSection === "Interests" && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">Add your interests (comma-separated)</p>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={editForm.interests.join(", ")}
                      onChange={(e) => setEditForm({...editForm, interests: e.target.value.split(",").map(i => i.trim()).filter(i => i)})}
                      placeholder="Enter your interests"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {editingSection === "Current Location" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Country of Origin</label>
                      <div className="relative">
                        <select 
                          value={editForm.country_of_origin}
                          onChange={(e) => setEditForm({...editForm, country_of_origin: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Search</option>
                          <option>Nigeria</option>
                          <option>Ghana</option>
                          <option>Kenya</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">State of Origin</label>
                      <div className="relative">
                        <select 
                          value={editForm.state_of_origin}
                          onChange={(e) => setEditForm({...editForm, state_of_origin: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Search</option>
                          <option>Lagos</option>
                          <option>Oyo</option>
                          <option>FCT</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">City of Origin</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={editForm.city_of_origin}
                          onChange={(e) => setEditForm({...editForm, city_of_origin: e.target.value})}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Country of Residence</label>
                      <div className="relative">
                        <select 
                          value={editForm.country_of_residence}
                          onChange={(e) => setEditForm({...editForm, country_of_residence: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Search</option>
                          <option>Nigeria</option>
                          <option>Ghana</option>
                          <option>Kenya</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">State of Residence</label>
                      <div className="relative">
                        <select 
                          value={editForm.state_of_residence}
                          onChange={(e) => setEditForm({...editForm, state_of_residence: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Search</option>
                          <option>Lagos</option>
                          <option>Oyo</option>
                          <option>FCT</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">City of Residence</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={editForm.city_of_residence}
                          onChange={(e) => setEditForm({...editForm, city_of_residence: e.target.value})}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingSection(null)}
                className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isUploading || isSaving}
                className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isSaving ? "Saving..." : isUploading ? "Uploading..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar (Mobile matching image) */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-[50]">
        <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
          <span className="font-display font-bold text-xl tracking-tight text-ink hidden sm:block">
            Paradise <span className="text-primary">Hub</span>
          </span>
        </button>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100 hover:bg-orange-100 transition-colors">
            <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
            </div>
            <span className="text-xs font-bold">{profile?.points?.toLocaleString() || 0}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) setUnreadCount(0);
              }}
              className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-[8px] text-white font-bold border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-50 font-bold text-ink flex justify-between items-center">
                    Notifications
                    <button onClick={() => setShowNotifications(false)}><X size={14} className="text-gray-400"/></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-4 text-center text-sm text-gray-400">
                    You're all caught up!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Grid size={20} />
          </button>
          
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden border border-gray-200 hover:border-primary transition-all">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(profile?.full_name)
            )}
          </button>
        </div>
      </nav>

      {/* Header Banner */}
      <div className="relative h-48 md:h-80 bg-gradient-to-r from-primary via-primary-light to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
        
        <div className="max-w-[1400px] mx-auto h-full flex items-center px-6 relative">
          <button 
            onClick={onBack}
            className="absolute top-8 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">
              <span className="text-yellow-400">Showcase</span> your Potential Here
            </h1>
          </div>

          <div className="absolute right-12 bottom-12 opacity-40 hidden lg:block">
            <div className="w-48 h-48 border-4 border-white/20 rounded-3xl rotate-12 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-white/20 rounded-2xl -rotate-12" />
            </div>
          </div>

          <button className="absolute right-6 top-8 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
            <Camera size={20} />
          </button>
        </div>
      </div>

      {/* Profile Info Bar */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 pb-8">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setEditingSection("Basic Info")}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={32} />
                    <span className="text-[10px] font-bold mt-1">Add Photo</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight uppercase">
              {isLoading ? "LOADING..." : profile?.full_name || "LEARNER"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary-light transition-colors">
              Copy link
            </button>
            <button 
              onClick={() => setEditingSection("Basic Info")}
              className="p-2 border border-gray-200 text-primary rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
                activeTab === tab ? "text-primary" : "text-gray-400 hover:text-ink"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 py-8">
          {/* Sidebar (Completion Card) - Appears first on mobile */}
          <div className="order-first lg:order-last space-y-8">
            {/* Completion Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-ink mb-6">Profile Completion</h3>
              
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-100" 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-primary transition-all duration-1000" 
                      strokeWidth="10" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * profileCompletion) / 100}
                      strokeLinecap="round"
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl md:text-2xl font-bold text-ink">
                      {profileCompletion}%
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {profileSections.map((section) => (
                    <div key={section.label} className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                        section.completed ? "bg-primary border-primary" : "border-gray-400"
                      )}>
                        {section.completed && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-600 truncate">{section.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* About Me Section */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-lg font-bold text-ink">About me</h3>
                <button 
                  onClick={() => setEditingSection("About")}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {profile?.about_me ? (
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{profile.about_me}</p>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <div className="w-14 h-9 md:w-16 md:h-10 border-2 border-gray-200 rounded-lg relative">
                      <div className="absolute top-2 left-2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-200" />
                      <div className="absolute top-2 right-2 w-5 h-1 md:w-6 md:h-1 bg-gray-200" />
                      <div className="absolute top-4 right-2 w-5 h-1 md:w-6 md:h-1 bg-gray-200" />
                      <div className="absolute top-6 right-2 w-5 h-1 md:w-6 md:h-1 bg-gray-200" />
                    </div>
                  </div>
                  <h4 className="text-primary font-bold mb-2">You seem like someone interesting...</h4>
                  <p className="text-sm text-gray-500 mb-8 max-w-xs">Tell us a little about you, your passion, what you live for...</p>
                  <button 
                    onClick={() => setEditingSection("About")}
                    className="w-full md:w-auto px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                  >
                    Add About Me Info
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Languages */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-ink">Languages</h3>
                  <button 
                    onClick={() => setEditingSection("Languages")}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors border border-gray-200 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="h-24 flex items-center justify-center">
                  <p className="text-xs text-gray-400">No languages added</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-ink">Phone Number</h3>
                  <button 
                    onClick={() => setEditingSection("Phone Number")}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Primary</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-sm text-gray-600">{profile?.phone_number || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">WhatsApp</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-sm text-gray-600">{profile?.whatsapp_number || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-ink">Social Profiles</h3>
                  <button 
                    onClick={() => setEditingSection("Social Profile")}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors border border-gray-200 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
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
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-xs text-gray-400">No social links added</p>
                  </div>
                )}
              </div>

              {/* Current Location */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-ink">Current Location</h3>
                  <button 
                    onClick={() => setEditingSection("Current Location")}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Origin</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-sm text-gray-600">{profile?.country_of_origin || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Residence</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-sm text-gray-600">{[profile?.city_of_residence, profile?.country_of_residence].filter(Boolean).join(', ') || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-ink">Interests</h3>
                <button 
                  onClick={() => setEditingSection("Interests")}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <div className="w-16 h-10 border-2 border-gray-200 rounded-lg relative flex items-center justify-center">
                    <Heart size={20} className="text-gray-200" />
                  </div>
                </div>
                <h4 className="text-primary font-bold mb-2">What are your interests?</h4>
                <p className="text-sm text-gray-500 mb-8">Share your interests to boost visibility and attract prospective employers</p>
                <button 
                  onClick={() => setEditingSection("Interests")}
                  className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                >
                  Add Interests
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar (Completion Card) - Moved to main content area for mobile */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ink text-white pt-24 pb-12 px-4 relative overflow-hidden mt-20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <BrandLogo wrapperClassName="w-10 h-10 rounded-lg shadow-inner" imgClassName="w-full h-full" />
                <span className="font-display font-bold text-2xl tracking-tight">
                  Paradise <span className="text-primary-light">Hub</span>
                </span>
              </div>
              <p className="text-gray-400 text-lg max-w-sm leading-relaxed mb-8">
                Empowering the next generation of African leaders through an interactive e-learning in technology and agribusiness.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8">Career Tracks</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary-light transition-colors">Agribusiness Innovation</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Sustainable Farm Management</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">AI-Powered Business Automation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/#testimonials" onClick={onBack} className="hover:text-primary-light transition-colors">About Us</a></li>
                <li><a href="/#testimonials" onClick={onBack} className="hover:text-primary-light transition-colors">Support</a></li>
                <li><a href="/#testimonials" onClick={onBack} className="hover:text-primary-light transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
            <div className="flex gap-8">
              <a href="/#testimonials" onClick={onBack} className="hover:text-white transition-colors">Privacy</a>
              <a href="/#testimonials" onClick={onBack} className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <div>© Copyright 2026 Paradise Dynamic Farms. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {renderModal()}
    </div>
  );
}
