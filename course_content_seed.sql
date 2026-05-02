-- Clean up old seed data to prevent duplicates (Cascade takes care of lessons, quizzes, etc.)
DELETE FROM public.modules;

---------------------------------------------------------------------------
-- 1. CREATE TABLES (Just in case any are missing)
---------------------------------------------------------------------------
create table if not exists public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id integer not null,
  title text not null,
  description text,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.lessons (
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

create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  title text not null,
  url text not null,
  resource_type text not null
);

create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null unique,
  title text not null,
  description text,
  passing_grade integer not null,
  duration_text text not null
);

create table if not exists public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question text not null,
  type text check (type in ('multiple-choice', 'text', 'link')) not null,
  options jsonb,
  correct_answer text,
  order_index integer not null
);

---------------------------------------------------------------------------
-- 2. CLEAN SLATE (Wipes old data so we don't get duplicates)
---------------------------------------------------------------------------
TRUNCATE TABLE public.modules CASCADE;

---------------------------------------------------------------------------
-- 3. SEED MODULES (3 modules per course for richer content)
---------------------------------------------------------------------------
INSERT INTO public.modules (course_id, title, description, order_index) VALUES
-- Course 101: Agribusiness Innovation
(101, 'Agribusiness Fundamentals', 'Understanding the core principles of modern agribusiness and food systems.', 1),
(101, 'Digital Agriculture Tools', 'Exploring IoT, sensors, and data-driven farming technologies.', 2),
(101, 'Sustainable Business Models', 'Building profitable and environmentally conscious agribusiness ventures.', 3),

-- Course 102: Sustainable Farm Management
(102, 'Soil Health & Conservation', 'Mastering soil science for long-term farm productivity.', 1),
(102, 'Eco-Friendly Crop Production', 'Organic and regenerative farming techniques.', 2),
(102, 'Climate-Smart Agriculture', 'Adapting to climate change with resilient farming practices.', 3),

-- Course 103: AI-Powered Business Automation
(103, 'AI for Business Leaders', 'Demystifying artificial intelligence for non-technical executives.', 1),
(103, 'Low-Code Automation', 'Building automated workflows without programming skills.', 2),
(103, 'Intelligent Process Optimization', 'Using AI to streamline and improve business operations.', 3);

---------------------------------------------------------------------------
-- 4. SEED LESSONS (Multiple lessons per module)
---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, title, type, content, video_url, duration, transcript, order_index) VALUES
-- Course 101: Module 1
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'The Global Food System', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '15 mins', 'Welcome to the world of agribusiness. Today we explore how food moves from farm to consumer...', 1),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'Understanding Value Chains', 'text', 'A value chain represents the full lifecycle of a product from raw materials to end consumer. In agriculture, this includes farming, processing, distribution, and retail. Optimizing each link reduces waste and increases profitability.', NULL, '12 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'Market Trends in Agriculture', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '18 mins', 'The agricultural sector is undergoing rapid transformation driven by technology and changing consumer preferences...', 3),

-- Course 101: Module 2
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'IoT Sensors for Farming', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '20 mins', 'Internet of Things devices are revolutionizing precision agriculture by providing real-time data...', 1),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Drone Technology in Agriculture', 'text', 'Drones equipped with multispectral cameras can assess crop health, detect irrigation issues, and monitor field conditions from above. This aerial perspective provides insights that ground-based monitoring cannot.', NULL, '15 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Data Analytics for Crop Management', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '22 mins', 'Big data analytics helps farmers make informed decisions about planting, fertilizing, and harvesting...', 3),

-- Course 101: Module 3
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Circular Economy in Agriculture', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '16 mins', 'The circular economy model minimizes waste and maximizes resource efficiency in farming...', 1),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Building Resilient Supply Chains', 'text', 'Resilient supply chains can withstand disruptions from weather events, market volatility, and global crises. Diversification and local sourcing are key strategies.', NULL, '14 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Social Impact Investing in Agribusiness', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '19 mins', 'Impact investing combines financial returns with measurable social and environmental benefits...', 3),

-- Course 102: Module 1
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Soil Microbiology Basics', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '18 mins', 'Soil is a living ecosystem teeming with microorganisms essential for plant health...', 1),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Soil Testing Methods', 'text', 'Regular soil testing provides crucial information about nutrient levels, pH balance, and organic matter content. This data guides fertilization and amendment decisions.', NULL, '13 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Regenerative Composting Techniques', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '21 mins', 'Composting transforms organic waste into nutrient-rich soil amendments...', 3),

-- Course 102: Module 2
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Organic Pest Management', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '17 mins', 'Biological control methods and companion planting reduce reliance on chemical pesticides...', 1),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Water Conservation Strategies', 'text', 'Efficient irrigation systems and drought-resistant crop varieties help farms thrive with limited water resources. Mulching and cover cropping also play important roles.', NULL, '16 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Biodynamic Farming Principles', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '24 mins', 'Biodynamic agriculture treats the farm as a self-sustaining organism...', 3),

-- Course 102: Module 3
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Carbon Farming Fundamentals', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '20 mins', 'Carbon farming practices sequester atmospheric CO2 in soil organic matter...', 1),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Climate-Resilient Crop Varieties', 'text', 'Plant breeders are developing crops that can withstand extreme weather conditions. Heat-tolerant and flood-resistant varieties are becoming increasingly important.', NULL, '15 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Agroforestry Systems', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '23 mins', 'Integrating trees with crops creates diverse, resilient agricultural systems...', 3),

-- Course 103: Module 1
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'AI for Non-Technical Leaders', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '14 mins', 'Artificial intelligence doesn''t require programming skills to implement effectively...', 1),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'Machine Learning Basics', 'text', 'Machine learning algorithms can identify patterns in data to make predictions and automate decisions. Understanding these concepts helps leaders evaluate AI opportunities.', NULL, '11 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'AI Ethics and Governance', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '16 mins', 'Responsible AI implementation requires careful consideration of privacy, bias, and transparency...', 3),

-- Course 103: Module 2
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'No-Code Automation Platforms', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '19 mins', 'Visual workflow builders allow anyone to create automated processes...', 1),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'API Integration Strategies', 'text', 'Application Programming Interfaces enable different software systems to communicate and share data. Understanding APIs unlocks powerful automation possibilities.', NULL, '17 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'Workflow Optimization', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '21 mins', 'Streamlining business processes eliminates bottlenecks and improves efficiency...', 3),

-- Course 103: Module 3
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'Predictive Analytics for Business', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '18 mins', 'AI-powered analytics can forecast trends and identify opportunities...', 1),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'Intelligent Document Processing', 'text', 'AI can automatically extract and process information from documents, invoices, and forms. This technology dramatically reduces manual data entry.', NULL, '14 mins', NULL, 2),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'AI-Powered Customer Service', 'video', NULL, 'https://www.youtube.com/watch?v=0k2OEj_nZ_U', '22 mins', 'Chatbots and virtual assistants provide 24/7 customer support...', 3);

---------------------------------------------------------------------------
-- 5. SEED RESOURCES
---------------------------------------------------------------------------
INSERT INTO public.resources (lesson_id, title, url, resource_type) VALUES
((SELECT id FROM lessons WHERE title = 'The Global Food System'), 'Global Agriculture Report 2024', '#', 'PDF'),
((SELECT id FROM lessons WHERE title = 'Understanding Value Chains'), 'Value Chain Analysis Template', '#', 'Document'),
((SELECT id FROM lessons WHERE title = 'IoT Sensors for Farming'), 'Sensor Selection Guide', '#', 'PDF'),
((SELECT id FROM lessons WHERE title = 'Drone Technology in Agriculture'), 'Drone Operation Checklist', '#', 'Document'),
((SELECT id FROM lessons WHERE title = 'Circular Economy in Agriculture'), 'Circular Agriculture Case Studies', '#', 'PDF'),
((SELECT id FROM lessons WHERE title = 'Soil Microbiology Basics'), 'Soil Food Web Diagram', '#', 'Image'),
((SELECT id FROM lessons WHERE title = 'Organic Pest Management'), 'Beneficial Insects Identification Guide', '#', 'PDF'),
((SELECT id FROM lessons WHERE title = 'Carbon Farming Fundamentals'), 'Carbon Credit Calculator', '#', 'Tool'),
((SELECT id FROM lessons WHERE title = 'AI for Non-Technical Leaders'), 'AI Readiness Assessment', '#', 'Document'),
((SELECT id FROM lessons WHERE title = 'No-Code Automation Platforms'), 'Platform Comparison Matrix', '#', 'Spreadsheet');

---------------------------------------------------------------------------
-- 6. SEED QUIZZES (One per module)
---------------------------------------------------------------------------
INSERT INTO public.quizzes (module_id, title, description, passing_grade, duration_text) VALUES
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'Agribusiness Fundamentals Quiz', 'Test your understanding of food systems and value chains.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Digital Agriculture Assessment', 'Evaluate your knowledge of farming technology and data analytics.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Sustainable Business Models Quiz', 'Assess your grasp of circular economy and impact investing.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Soil Science & Conservation Quiz', 'Check your understanding of soil health and microbiology.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Organic Farming Assessment', 'Test your knowledge of sustainable crop production methods.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Climate-Smart Agriculture Quiz', 'Evaluate your understanding of resilient farming practices.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'AI Concepts for Leaders Quiz', 'Assess your understanding of artificial intelligence fundamentals.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'Automation Platforms Assessment', 'Test your knowledge of no-code automation tools.', 3, '15 mins'),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'Intelligent Process Optimization Quiz', 'Evaluate your grasp of AI-powered business improvements.', 3, '15 mins');

---------------------------------------------------------------------------
-- 7. SEED QUIZ QUESTIONS (Multiple questions per quiz)
---------------------------------------------------------------------------
INSERT INTO public.quiz_questions (quiz_id, question, type, options, correct_answer, order_index) VALUES
-- Course 101: Module 1 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Agribusiness Fundamentals Quiz'),
  $$What is the primary goal of optimizing an agricultural value chain?$$,
  'multiple-choice',
  $$["Maximizing individual farmer profits only", "Reducing waste and increasing efficiency across the entire supply chain", "Eliminating middlemen completely", "Focusing only on retail pricing"]$$::jsonb,
  $$Reducing waste and increasing efficiency across the entire supply chain$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Agribusiness Fundamentals Quiz'),
  $$Which technology is most likely to disrupt traditional agricultural supply chains?$$,
  'multiple-choice',
  $$["Improved tractor design", "Blockchain for food traceability", "Larger storage facilities", "Manual record keeping"]$$::jsonb,
  $$Blockchain for food traceability$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Agribusiness Fundamentals Quiz'),
  $$Explain how consumer preferences are changing agricultural markets.$$,
  'text',
  NULL,
  $$Consumers increasingly demand organic, locally sourced, and sustainably produced food, driving market shifts toward these practices.$$,
  3
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Agribusiness Fundamentals Quiz'),
  $$Share a link to an agricultural market trend report you'd like to explore further.$$,
  'link',
  NULL,
  $$Any valid link to agricultural market research or trend analysis$$,
  4
),

-- Course 101: Module 2 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Digital Agriculture Assessment'),
  $$What type of data do IoT sensors typically collect on farms?$$,
  'multiple-choice',
  $$["Employee attendance records", "Soil moisture, temperature, and nutrient levels", "Weather forecasts only", "Equipment maintenance schedules"]$$::jsonb,
  $$Soil moisture, temperature, and nutrient levels$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Digital Agriculture Assessment'),
  $$How can drone technology improve farming efficiency?$$,
  'multiple-choice',
  $$["Replace all human farm workers", "Provide aerial views for crop monitoring and field assessment", "Only take promotional photos", "Transport goods between farms"]$$::jsonb,
  $$Provide aerial views for crop monitoring and field assessment$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Digital Agriculture Assessment'),
  $$Describe how data analytics can optimize irrigation scheduling.$$,
  'text',
  NULL,
  $$Data analytics can predict optimal watering times based on soil moisture levels, weather forecasts, and crop water requirements, reducing water waste.$$,
  3
),

-- Course 101: Module 3 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Sustainable Business Models Quiz'),
  $$What is a key principle of the circular economy in agriculture?$$,
  'multiple-choice',
  $$["Maximize waste production", "Keep resources in use for as long as possible", "Use only virgin materials", "Focus on linear production processes"]$$::jsonb,
  $$Keep resources in use for as long as possible$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Sustainable Business Models Quiz'),
  $$How does impact investing differ from traditional investing?$$,
  'multiple-choice',
  $$["It only invests in non-profit organizations", "It considers both financial returns and positive social/environmental impact", "It avoids all business investments", "It focuses only on short-term gains"]$$::jsonb,
  $$It considers both financial returns and positive social/environmental impact$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Sustainable Business Models Quiz'),
  $$What makes a supply chain resilient to disruptions?$$,
  'text',
  NULL,
  $$Diversification of suppliers, local sourcing, backup systems, and flexible logistics make supply chains more resilient.$$,
  3
),

-- Course 102: Module 1 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Soil Science & Conservation Quiz'),
  $$Why is soil organic matter important for plant growth?$$,
  'multiple-choice',
  $$["It makes soil look darker", "It improves water retention and nutrient availability", "It increases soil density", "It prevents root growth"]$$::jsonb,
  $$It improves water retention and nutrient availability$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Soil Science & Conservation Quiz'),
  $$What role do microorganisms play in soil health?$$,
  'multiple-choice',
  $$["They compete with plants for nutrients", "They break down organic matter and make nutrients available to plants", "They only cause plant diseases", "They have no impact on soil fertility"]$$::jsonb,
  $$They break down organic matter and make nutrients available to plants$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Soil Science & Conservation Quiz'),
  $$Explain the benefits of regenerative composting for soil health.$$,
  'text',
  NULL,
  $$Regenerative composting builds soil structure, increases microbial activity, improves water retention, and provides slow-release nutrients.$$,
  3
),

-- Course 102: Module 2 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Organic Farming Assessment'),
  $$What is companion planting in organic pest management?$$,
  'multiple-choice',
  $$["Planting crops at different times", "Planting compatible plants together to naturally repel pests", "Using chemical pesticides", "Growing only one crop type"]$$::jsonb,
  $$Planting compatible plants together to naturally repel pests$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Organic Farming Assessment'),
  $$Why is water conservation important in sustainable agriculture?$$,
  'multiple-choice',
  $$["It reduces electricity costs only", "It ensures long-term water availability and ecosystem health", "It increases irrigation expenses", "It has no environmental benefits"]$$::jsonb,
  $$It ensures long-term water availability and ecosystem health$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Organic Farming Assessment'),
  $$Describe how biodynamic farming differs from conventional organic farming.$$,
  'text',
  NULL,
  $$Biodynamic farming treats the farm as a self-sustaining organism, incorporating cosmic and lunar cycles, and using specific herbal preparations.$$,
  3
),

-- Course 102: Module 3 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Climate-Smart Agriculture Quiz'),
  $$How does carbon farming help combat climate change?$$,
  'multiple-choice',
  $$["It releases more CO2 into the atmosphere", "It sequesters carbon in soil organic matter", "It eliminates the need for photosynthesis", "It increases greenhouse gas emissions"]$$::jsonb,
  $$It sequesters carbon in soil organic matter$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Climate-Smart Agriculture Quiz'),
  $$What is agroforestry and why is it climate-resilient?$$,
  'multiple-choice',
  $$["Growing trees in urban areas", "Integrating trees with crops for diverse, resilient systems", "Deforesting for more farmland", "Planting only annual crops"]$$::jsonb,
  $$Integrating trees with crops for diverse, resilient systems$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Climate-Smart Agriculture Quiz'),
  $$How can crop varieties help farmers adapt to climate change?$$,
  'text',
  NULL,
  $$Climate-resilient crop varieties can withstand drought, heat, flooding, and pests, ensuring food security in changing conditions.$$,
  3
),

-- Course 103: Module 1 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'AI Concepts for Leaders Quiz'),
  $$What is the main advantage of AI for non-technical business leaders?$$,
  'multiple-choice',
  $$["It requires extensive programming knowledge", "It automates complex tasks without coding skills", "It only works for tech companies", "It replaces all human workers"]$$::jsonb,
  $$It automates complex tasks without coding skills$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'AI Concepts for Leaders Quiz'),
  $$How does machine learning differ from traditional programming?$$,
  'multiple-choice',
  $$["It requires more manual coding", "It learns patterns from data instead of following explicit instructions", "It only works with simple calculations", "It cannot make predictions"]$$::jsonb,
  $$It learns patterns from data instead of following explicit instructions$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'AI Concepts for Leaders Quiz'),
  $$Why is AI ethics important for business leaders?$$,
  'text',
  NULL,
  $$AI ethics ensures responsible implementation, prevents bias, protects privacy, and maintains transparency in automated decision-making.$$,
  3
),

-- Course 103: Module 2 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Automation Platforms Assessment'),
  $$What is a key benefit of no-code automation platforms?$$,
  'multiple-choice',
  $$["They require advanced programming skills", "They allow non-technical users to build automated workflows", "They only work with one specific application", "They increase manual work"]$$::jsonb,
  $$They allow non-technical users to build automated workflows$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Automation Platforms Assessment'),
  $$How do APIs enable business automation?$$,
  'multiple-choice',
  $$["They prevent different systems from communicating", "They allow different software applications to exchange data and trigger actions", "They only work within single applications", "They require manual data transfer"]$$::jsonb,
  $$They allow different software applications to exchange data and trigger actions$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Automation Platforms Assessment'),
  $$What is workflow optimization in business automation?$$,
  'text',
  NULL,
  $$Workflow optimization identifies and eliminates bottlenecks, streamlines processes, and improves efficiency through automated task sequencing.$$,
  3
),

-- Course 103: Module 3 Quiz
(
  (SELECT id FROM public.quizzes WHERE title = 'Intelligent Process Optimization Quiz'),
  $$How can predictive analytics benefit businesses?$$,
  'multiple-choice',
  $$["It only analyzes past data", "It forecasts future trends and identifies opportunities", "It cannot make accurate predictions", "It replaces all human decision-making"]$$::jsonb,
  $$It forecasts future trends and identifies opportunities$$,
  1
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Intelligent Process Optimization Quiz'),
  $$What is intelligent document processing?$$,
  'multiple-choice',
  $$["Manual data entry from documents", "AI-powered automatic extraction of information from documents", "Printing documents only", "Storing paper documents digitally"]$$::jsonb,
  $$AI-powered automatic extraction of information from documents$$,
  2
),
(
  (SELECT id FROM public.quizzes WHERE title = 'Intelligent Process Optimization Quiz'),
  $$Describe how AI-powered customer service improves business operations.$$,
  'text',
  NULL,
  $$AI-powered customer service provides 24/7 support, handles routine inquiries, escalates complex issues, and learns from interactions to improve responses.$$,
  3
);