# Referral System Setup Guide

This guide walks you through setting up the referral system for Paradise Hub. **Points are awarded only after email verification** to prevent abuse.

## Overview

The referral system consists of three parts:
1. **Database Structure** - Tracks who referred whom and triggers point awards on email verification
2. **Frontend Logic** - Captures referral codes during signup and provides sharing functionality  
3. **Rewards Display** - Shows referral link and sharing options on the Rewards page

---

## Part 1: Database Setup (Required)

**Run these SQL commands in your Supabase SQL Editor** (go to SQL Editor in your Supabase dashboard).

### Step 1: Add referral tracking column
```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
```

### Step 2: Create the referral reward function (SECURITY DEFINER)
```sql
CREATE OR REPLACE FUNCTION public.award_referral_points_on_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger when email changes from unverified to verified
    IF (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) THEN
        
        -- Find who referred this user and add 5 points
        UPDATE public.profiles
        SET points = points + 5
        WHERE id = (
            SELECT referred_by 
            FROM public.profiles 
            WHERE id = NEW.id
            AND referred_by IS NOT NULL
        );
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### Step 3: Create the trigger on auth.users table
```sql
DROP TRIGGER IF EXISTS on_auth_user_verified ON auth.users;

CREATE TRIGGER on_auth_user_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.award_referral_points_on_verification();
```

### Step 4: Ensure handle_new_user captures referred_by

Verify that your existing `handle_new_user()` trigger (created during profile setup) includes `referred_by` in the insert. It should look like:

```sql
-- Your existing handle_new_user should already do this, but verify:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referred_by)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'referred_by')::uuid
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

---

## Part 2: Frontend Implementation (Already Done)

The frontend is already updated with:

1. **AuthPage.tsx** - Captures `?ref=UUID` from the URL and passes it during signup
2. **RewardsPage.tsx** - Shows referral link with Copy and WhatsApp share buttons
3. **referral.ts** - Helper utilities for referral logic

**No additional frontend changes needed** — the code is ready to go!

---

## Part 3: Testing the Referral System

### Test Flow:
1. Go to your Paradise Hub dashboard
2. **As User A**: Go to Rewards page → Find "Invite Friends, Earn Points" section
3. **Copy** your referral link (e.g., `https://yourdomain.com/signup?ref=USER-UUID`)
4. **As User B** (in a different browser/incognito): Click the referral link
5. **Sign up** with User B's email
6. **Verify User B's email** by clicking the confirmation link in their inbox
7. ✅ **User A receives 5 Harvest Points** (automatic, handled by database trigger)

---

## How It Works

### Verification Gate
```
User Signs Up
    ↓
Email Sent
    ↓
User Clicks Verification Link
    ↓
auth.users.email_confirmed_at set to NOW()
    ↓
Trigger fires: on_auth_user_verified
    ↓
Referrer gets +5 points (if referred_by is set)
```

### Why This Approach?

✅ **Prevents abuse**: Points only awarded after real email verification  
✅ **No manual intervention**: Completely automated via database trigger  
✅ **Secure**: Uses `SECURITY DEFINER` to safely update points  
✅ **Transparent**: User sees the link but points happen invisibly  

---

## URL Referral Link Format

When a user shares their referral link, it looks like:
```
https://paradise-hub.com/signup?ref=550e8400-e29b-41d4-a716-446655440000
```

The `?ref=` parameter is the referrer's UUID from `auth.users.id`.

---

## Troubleshooting

### "Referral link is empty"
- Make sure you're logged in before viewing the Rewards page
- `currentUserId` must be passed to the RewardsPage component

### "Points not awarded after verification"
- Check that the user clicked the email verification link
- Verify the `referred_by` column exists on profiles table
- Check that the trigger was created successfully in Supabase

### "Handle new user not capturing referred_by"
- Make sure your `handle_new_user()` function includes the `referred_by` line
- Run the SQL from Step 4 to update the function

---

## Next Steps

After setting up the database SQL:
1. Test the flow with a test account
2. Monitor Supabase Logs to see if the trigger fires
3. Share referral links with beta users
4. Track referral points in the dashboard

You're all set! 🎉
