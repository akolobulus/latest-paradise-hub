# Supabase Setup Guide for Paradise Hub

This guide walks you through setting up your Supabase backend for Paradise Hub LMS.

## Prerequisites

- A Supabase project created
- Your project URL and anonymous key (already configured in `.env`)

---

## Step 1: Create Database Schema

Go to your Supabase dashboard, navigate to the **SQL Editor**, and run the following SQL script:

```sql
-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  points integer default 0,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enrollments Table (Replaces enrolledPrograms state)
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id integer not null, -- Maps to your local course IDs (e.g., 1, 2, 101)
  payment_status text check (payment_status in ('pending', 'verified')) default 'pending',
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- 3. Lesson Progress Table (Replaces completedLessons state)
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id integer not null,
  lesson_id text not null, -- Maps to "1-1", "2-1", etc.
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- 4. Quiz Results Table (Replaces passedQuizzes state)
create table public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id text not null,
  score integer not null,
  passed boolean default false,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, quiz_id)
);

-- 5. Posts Table (Community Hub Feed)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  channel text not null, -- e.g., 'general', 'agribusiness', 'career-advice', 'showcase'
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Post Likes Table (Track who liked what)
create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_results enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;

-- Security Policies (Users can only see/edit their own data)
create policy "Users can view own profile" on profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

create policy "Users can view own enrollments" on enrollments for select using ( auth.uid() = user_id );
create policy "Users can insert own enrollments" on enrollments for insert with check ( auth.uid() = user_id );
create policy "Users can update own enrollments" on enrollments for update using ( auth.uid() = user_id );

create policy "Users can view own progress" on lesson_progress for select using ( auth.uid() = user_id );
create policy "Users can insert own progress" on lesson_progress for insert with check ( auth.uid() = user_id );

create policy "Users can view own quiz results" on quiz_results for select using ( auth.uid() = user_id );
create policy "Users can insert own quiz results" on quiz_results for insert with check ( auth.uid() = user_id );

-- Policies for Community Posts
create policy "Anyone can view posts" on posts for select using (true);
create policy "Users can insert their own posts" on posts for insert with check (auth.uid() = author_id);

-- Policies for Post Likes
create policy "Anyone can view likes" on post_likes for select using (true);
create policy "Users can toggle their own likes" on post_likes for insert with check (auth.uid() = user_id);
create policy "Users can untoggle their own likes" on post_likes for delete using (auth.uid() = user_id);

-- Enable Realtime for Community Feed (real-time posts & likes updates)
alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table post_likes;

-- Trigger to automatically create a profile when a user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## Step 2: Create the Points Increment Function

This function safely increments user points and prevents race conditions:

```sql
create or replace function increment_points(amount integer, row_id uuid)
returns void as $$
begin
  update profiles
  set points = points + amount
  where id = row_id;
end;
$$ language plpgsql;
```

---

## Step 3: Configure Email Authentication

1. Go to **Authentication** → **Settings**
2. Under **Email Configuration**, enable Email authentication
3. For development, use the default Supabase email provider
4. For production, configure your own SMTP provider

---

## Step 4: Test Your Setup

### Test Authentication

1. Open Paradise Hub in your browser
2. Click **"Sign up"** or **"Log in"**
3. Enter your email and password
4. A confirmation email will be sent (check your email or Supabase dashboard logs)
5. Confirm your email and log in

### Test Course Enrollment

1. After logging in, enroll in a course
2. Check the Supabase dashboard under **Table Editor** → **enrollments**
3. You should see a new row with your user_id, course_id, and payment_status = 'pending'

### Test Progress Tracking

1. While in a course, complete a lesson
2. Check **lesson_progress** table - a new row should appear
3. Check your **profiles** table - your points should increase by 50

### Test Quiz Results

1. Complete a quiz and pass it
2. Check **quiz_results** table - a new row should appear with passed = true
3. Check your **profiles** table - your points should increase by 200

---

## Step 5: Test Community Feed (Real-time Posts)

1. Log in and navigate to the Community Hub
2. Create a new post in any channel
3. The post should appear immediately in the feed
4. Like a post - the like count should increment in real-time
5. In another browser/tab, open the same channel and see new posts appear instantly without page refresh

---

## Step 6: Enable Authentication Providers (Optional)

For social sign-in (Google, GitHub, LinkedIn):

1. Go to **Authentication** → **Settings**
2. Scroll to **Auth Providers** section
3. Click on the provider you want to enable (Google, GitHub, etc.)
4. Add your provider's client ID and secret
5. Save

The auth UI in your app will automatically detect enabled providers.

---

## Environment Variables

Your `.env` file is already configured with:

```env
VITE_SUPABASE_URL=https://ndtywenvmjzdxasunymp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These credentials are required for the frontend to connect to Supabase.

---

## Database Schema Overview

### profiles

- **id**: UUID (references auth.users)
- **email**: User's email
- **full_name**: User's full name
- **points**: Total points earned (default: 0)
- **avatar_url**: User's profile picture URL
- **created_at**: Account creation timestamp

### enrollments

- **id**: UUID (primary key)
- **user_id**: References profiles.id
- **course_id**: Course ID (matches your frontend course IDs)
- **payment_status**: "pending" or "verified"
- **enrolled_at**: Enrollment timestamp

### lesson_progress

- **id**: UUID (primary key)
- **user_id**: References profiles.id
- **course_id**: Course ID
- **lesson_id**: Lesson identifier (e.g., "1-1", "2-3")
- **completed_at**: Completion timestamp

### quiz_results

- **id**: UUID (primary key)
- **user_id**: References profiles.id
- **quiz_id**: Quiz identifier
- **score**: Number of correct answers
- **passed**: Boolean indicating if quiz was passed
- **completed_at**: Completion timestamp

### posts

- **id**: UUID (primary key)
- **author_id**: UUID (references profiles.id)
- **channel**: Text field (e.g., 'general', 'agribusiness', 'career-advice')
- **content**: Post text content
- **image_url**: Optional URL for post image
- **created_at**: Post creation timestamp

### post_likes

- **post_id**: UUID (references posts.id) - part of composite key
- **user_id**: UUID (references profiles.id) - part of composite key
- **created_at**: When the like was created

## Security Best Practices

✅ **What's Implemented:**

- Row Level Security (RLS) enabled on all tables
- Users can only view/edit their own data
- Automatic profile creation on signup
- Secure password hashing (handled by Supabase)

✅ **For Production:**

- Set email provider to production SMTP
- Enable 2FA for admin accounts
- Review and test all RLS policies
- Set up database backups
- Monitor API usage and set rate limits

---

## Troubleshooting

### "Missing Supabase environment variables"

- Check that `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not empty

### "Failed to sign up"

- Check email provider settings in Supabase dashboard
- Verify email confirmation is enabled
- Check Supabase logs for error details

### "Points not updating"

- Ensure `increment_points` function was created in SQL Editor
- Check that user is logged in (session exists)
- Verify RLS policies allow insert/update operations

### "Can't see enrollments"

- Ensure user is logged in
- Check RLS policy: "Users can view own enrollments"
- Verify enrollment was inserted with correct user_id

### "Real-time posts not updating"

- Ensure Realtime is enabled for `posts` and `post_likes` tables
- Check that you ran: `alter publication supabase_realtime add table posts;`
- Verify browser connection is stable
- Check browser console for Supabase errors
- Realtime subscriptions require active session (user logged in)

## Next Steps

1. ✅ Run the SQL schema
2. ✅ Test authentication flow
3. ✅ Test enrollment and progress tracking
4. ✅ Set up community feed with real-time posts
5. 📋 Implement post comments/replies (future enhancement)
6. 📋 Configure email notifications (future enhancement)
7. 📋 Set up admin dashboard for course management
8. 📋 Implement payment provider integration with Paystack

---

## Support

For issues or questions:

- Check [Supabase Documentation](https://supabase.com/docs)
- Review [Supabase SQL Guide](https://supabase.com/docs/guides/sql-editor)
- Contact Supabase support through your dashboard
