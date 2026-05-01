# Course Content Migration to Supabase - Complete Setup Guide

## ✅ What's Done

1. **Created `src/lib/courseApi.ts`** - Powerful nested query function that fetches all course content in one request
2. **Updated `CoursePlayer.tsx`** - Now dynamically fetches from Supabase with automatic fallback to hardcoded content
3. **Ready-to-run SQL schema** - All tables defined below

---

## 🚀 Step-by-Step Setup

### **Step 1: Run the SQL Schema in Supabase**

Go to your **Supabase Dashboard** → **SQL Editor** → **New Query** and paste this entire script:

```sql
-- 1. Modules (Weeks)
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id integer not null,
  title text not null,
  description text,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Lessons
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  type text check (type in ('video', 'text')) not null,
  content text,
  video_url text,
  duration text,
  transcript text,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Lesson Resources
create table public.resources (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  title text not null,
  url text not null,
  resource_type text not null
);

-- 4. Quizzes
create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null unique,
  title text not null,
  description text,
  passing_grade integer not null,
  duration_text text not null
);

-- 5. Quiz Questions
create table public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question text not null,
  type text check (type in ('multiple-choice', 'text', 'link')) not null,
  options jsonb,
  correct_answer text,
  order_index integer not null
);

-- Enable RLS
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;

-- Anyone can read course content (it's public!)
create policy "Anyone can read modules" on modules for select using (true);
create policy "Anyone can read lessons" on lessons for select using (true);
create policy "Anyone can read resources" on resources for select using (true);
create policy "Anyone can read quizzes" on quizzes for select using (true);
create policy "Anyone can read quiz questions" on quiz_questions for select using (true);

-- Enable Realtime (optional, but great for live updates)
alter publication supabase_realtime add table modules;
alter publication supabase_realtime add table lessons;
alter publication supabase_realtime add table resources;
alter publication supabase_realtime add table quizzes;
alter publication supabase_realtime add table quiz_questions;
```

Click **Run** ✅

---

### **Step 2: Insert Test Data**

Use Supabase's **Table Editor** to manually add one test module with lessons. The `fetchCourseContent()` function requires `course_id` to match what you pass from the frontend.

**Example:**

- Create a module with `course_id: 1`, `title: "Week 1: Intro"`, `order_index: 1`
- Create a lesson under that module with `title: "Getting Started"`, `video_url: "[YouTube link]"`, `order_index: 1`

---

### **Step 3: Test the Integration**

1. **Refresh your app** (Cmd/Ctrl + Shift + R)
2. Click into a course
3. Check browser **Console** (F12) for any errors
4. The sidebar should show your database modules and lessons
5. Click a lesson - it should display your database content

---

## 📋 Database Field Mapping

Your frontend interfaces are automatically mapped from the database:

| Database Column                 | Frontend Property        | Type       | Example                    |
| ------------------------------- | ------------------------ | ---------- | -------------------------- |
| `modules.title`                 | `week.title`             | string     | "Week 1: Fundamentals"     |
| `lessons.video_url`             | `lesson.videoUrl`        | string     | "https://youtube.com/..."  |
| `lessons.content`               | `lesson.content`         | string     | Lesson text                |
| `quiz_questions.options`        | `question.options`       | JSON array | `["Option A", "Option B"]` |
| `quiz_questions.correct_answer` | `question.correctAnswer` | string     | "Option A"                 |

---

## 🔄 Fallback System

If Supabase fetch fails or returns no data:

- ✅ App automatically uses hardcoded `COURSE_CONTENTS[course.id]`
- ✅ User never sees a blank page
- ✅ Development works offline

---

## 🆘 Troubleshooting

**"Course Content Coming Soon" message?**

- Check that `modules` table has entries with matching `course_id`
- Check browser Console (F12) for fetch errors

**Database not loading?**

- Verify RLS policies are created (copy/paste step 1 again)
- Check that `course_id` values match between frontend and database

**Missing lessons?**

- Verify each lesson has `module_id` pointing to correct module
- Check `order_index` is set sequentially (1, 2, 3...)

---

## 🎯 Next: Manage Course Content

Once this is working, you can now:

1. Add new modules without touching code
2. Update lesson videos instantly
3. Add/remove quiz questions live
4. Use Supabase's **Table Editor** as your CMS

No more deployments for content changes! 🚀
