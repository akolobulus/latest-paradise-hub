// src/lib/streak.ts
// ─────────────────────────────────────────────────────────────
// Call logActivity() at every activity trigger:
//   • On successful login
//   • After a lesson is marked complete
//   • After a community post is created
//
// It is idempotent — safe to call many times per day.
// The Supabase RPC handles the upsert and streak recalculation.
// ─────────────────────────────────────────────────────────────

import { supabase } from "@/src/lib/supabase";

/**
 * Logs today's activity for the current user and returns their
 * updated streak count. Safe to call multiple times per day.
 *
 * @returns the user's current streak (number of consecutive days)
 *          or null if the user is not authenticated
 */
export async function logActivity(): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc("log_activity_and_update_streak");

    if (error) {
      console.error("[streak] Error logging activity:", error.message);
      return null;
    }

    return data as number;
  } catch (err) {
    console.error("[streak] Unexpected error:", err);
    return null;
  }
}

/**
 * Reads the stored streak for any user (for leaderboard display).
 * This is a simple select — no write side effects.
 */
export async function getUserStreak(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("streak")
      .eq("id", userId)
      .single();

    if (error || !data) return 0;
    return data.streak ?? 0;
  } catch {
    return 0;
  }
}
