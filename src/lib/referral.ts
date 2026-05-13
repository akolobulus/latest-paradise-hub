/**
 * Referral System Utility
 * Handles referral signup logic and link generation
 */

import { supabase } from "./supabase";

/**
 * Sign up a user with optional referral code
 * The referred_by code is passed in metadata and should be captured by the handle_new_user trigger
 */
export async function signUpUserWithReferral(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  referralCode?: string | null
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`.trim(),
        referred_by: referralCode || undefined,
      }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * Get the base URL for app links.
 * Uses VITE_APP_URL in production and falls back to the current origin.
 */
export function getBaseUrl(): string {
  const url = import.meta.env.VITE_APP_URL?.trim() || window.location.origin;
  return url.replace(/\/+$/, "");
}

/**
 * Generate a referral link for sharing
 */
export function generateReferralLink(userId: string): string {
  return `${getBaseUrl()}/signup?ref=${userId}`;
}

/**
 * Get referral code from URL query parameters
 */
export function getReferralCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

/**
 * Award points to referrer when someone verifies their email
 * This is handled by the database trigger on auth.users table,
 * but we include this for reference in case you need to do it manually
 */
export async function awardReferralPointsManually(referrerId: string) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ points: supabase.rpc("increment", { amount: 5 }) })
      .eq("id", referrerId);
    
    if (error) throw error;
  } catch (err) {
    console.error("Error awarding referral points:", err);
  }
}
