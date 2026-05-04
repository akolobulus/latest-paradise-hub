-- Seed data for Paradise Hub courses 101, 102, and 103
-- Run this in your Supabase SQL Editor after setting up the schema

-- Insert modules for Course 101: Introduction to Agribusiness
INSERT INTO modules (course_id, title, description, order_index) VALUES
(101, 'Understanding Agribusiness Fundamentals', 'Learn the basics of agribusiness and its importance in modern agriculture.', 1),
(101, 'Market Analysis and Planning', 'Discover how to analyze markets and create effective business plans for agricultural ventures.', 2),
(101, 'Financial Management in Agriculture', 'Master the financial aspects of running an agricultural business.', 3),
(101, 'Sustainable Farming Practices', 'Explore sustainable farming methods and their business implications.', 4);

-- Insert lessons for Course 101
INSERT INTO lessons (module_id, title, content, type, duration, order_index) VALUES
-- Module 1 lessons
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'What is Agribusiness?', 'Agribusiness encompasses all activities involved in the production, processing, and distribution of agricultural products. It includes farming, processing, distribution, and marketing of agricultural commodities.', 'text', '15 min', 1),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'The Agribusiness Value Chain', 'Learn about the complete value chain from farm to consumer, including inputs, production, processing, distribution, and retail.', 'video', '20 min', 2),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'Career Opportunities in Agribusiness', 'Explore various career paths in agribusiness including farming, consulting, research, and entrepreneurship.', 'text', '12 min', 3),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'Case Study: Successful Agribusiness Ventures', 'Analyze real-world examples of successful agribusiness companies and what made them thrive.', 'video', '18 min', 4),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'Agribusiness Trends and Innovations', 'Stay updated on the latest trends shaping the future of agribusiness.', 'text', '16 min', 5),

-- Module 2 lessons
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Market Research Fundamentals', 'Learn how to conduct effective market research for agricultural products and services.', 'text', '14 min', 1),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Demand and Supply Analysis', 'Understand the principles of supply and demand in agricultural markets.', 'video', '22 min', 2),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Competitor Analysis', 'Learn how to identify and analyze your competitors in the agribusiness sector.', 'text', '15 min', 3),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Creating a Business Plan', 'Step-by-step guide to creating a comprehensive business plan for your agribusiness venture.', 'video', '25 min', 4),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Risk Assessment and Management', 'Identify potential risks in agribusiness and develop strategies to mitigate them.', 'text', '18 min', 5),

-- Module 3 lessons
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Financial Planning Basics', 'Introduction to financial planning principles for agricultural businesses.', 'text', '16 min', 1),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Budgeting for Agricultural Operations', 'Learn how to create and manage budgets for farming operations.', 'video', '20 min', 2),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Cost-Benefit Analysis', 'Master the art of evaluating the financial viability of agricultural investments.', 'text', '17 min', 3),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Funding and Investment Strategies', 'Explore various funding options and investment strategies for agribusiness.', 'video', '23 min', 4),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Financial Risk Management', 'Learn strategies to protect your agribusiness from financial risks.', 'text', '19 min', 5),

-- Module 4 lessons
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 4), 'Principles of Sustainable Agriculture', 'Understand the core principles of sustainable farming practices.', 'text', '15 min', 1),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 4), 'Organic Farming Methods', 'Explore organic farming techniques and their benefits.', 'video', '21 min', 2),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 4), 'Water Conservation Techniques', 'Learn effective water management strategies for sustainable agriculture.', 'text', '16 min', 3),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 4), 'Soil Health Management', 'Discover methods to maintain and improve soil health for long-term productivity.', 'video', '19 min', 4),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 4), 'Climate-Smart Agriculture', 'Adapt your farming practices to changing climate conditions.', 'text', '20 min', 5);

-- Insert quizzes for Course 101
INSERT INTO quizzes (module_id, title, description, passing_grade, duration_text) VALUES
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 1), 'Agribusiness Fundamentals Quiz', 'Test your understanding of agribusiness basics', 7, '10 minutes'),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 2), 'Market Analysis Quiz', 'Assess your knowledge of market analysis and business planning', 7, '12 minutes'),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 3), 'Financial Management Quiz', 'Evaluate your understanding of agricultural finance', 7, '15 minutes'),
((SELECT id FROM modules WHERE course_id = 101 AND order_index = 4), 'Sustainable Practices Quiz', 'Test your knowledge of sustainable farming methods', 7, '10 minutes');

-- Insert quiz questions for Course 101
INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer, order_index) VALUES
-- Quiz 1 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'What does agribusiness encompass?', 'multiple-choice', '["Only farming activities", "Production, processing, and distribution of agricultural products", "Only food processing", "Only retail sales"]', 'Production, processing, and distribution of agricultural products', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'Which of the following is NOT part of the agribusiness value chain?', 'multiple-choice', '["Farm inputs", "Production", "Manufacturing cars", "Distribution"]', 'Manufacturing cars', 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'Name one career opportunity in agribusiness.', 'text', NULL, NULL, 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'What are the main components of a successful agribusiness venture?', 'multiple-choice', '["Only good farming practices", "Market understanding, financial management, and sustainable practices", "Only modern technology", "Only government subsidies"]', 'Market understanding, financial management, and sustainable practices', 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'Why is staying updated on agribusiness trends important?', 'text', NULL, NULL, 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'What is the primary goal of agribusiness?', 'multiple-choice', '["Only food production", "To create value and profit from agricultural activities", "Only environmental conservation", "Only technological advancement"]', 'To create value and profit from agricultural activities', 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'Describe how innovation affects agribusiness.', 'text', NULL, NULL, 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'What role does technology play in modern agribusiness?', 'multiple-choice', '["No role", "Limited role", "Significant role in improving efficiency", "Only for large corporations"]', 'Significant role in improving efficiency', 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'How can small-scale farmers benefit from agribusiness knowledge?', 'text', NULL, NULL, 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 1)), 'What is the relationship between agribusiness and food security?', 'multiple-choice', '["No relationship", "Indirect relationship", "Direct relationship through efficient production", "Only through imports"]', 'Direct relationship through efficient production', 10),

-- Quiz 2 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'What is the first step in conducting market research?', 'multiple-choice', '["Create a business plan", "Define your research objectives", "Analyze competitors", "Set prices"]', 'Define your research objectives', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'How does supply and demand affect agricultural prices?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'What information should be included in a competitor analysis?', 'multiple-choice', '["Only their prices", "Their strengths, weaknesses, market share, and strategies", "Only their location", "Only their products"]', 'Their strengths, weaknesses, market share, and strategies', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'Which section of a business plan outlines how the business will make money?', 'multiple-choice', '["Executive summary", "Financial projections", "Operations plan", "Market analysis"]', 'Financial projections', 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'Name one common risk in agribusiness that should be assessed.', 'text', NULL, NULL, 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'What is the purpose of a SWOT analysis in business planning?', 'multiple-choice', '["Only to identify strengths", "To identify strengths, weaknesses, opportunities, and threats", "Only for marketing", "Only for financial planning"]', 'To identify strengths, weaknesses, opportunities, and threats', 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'How can market research help reduce business risks?', 'text', NULL, NULL, 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'What is the difference between primary and secondary market research?', 'multiple-choice', '["Primary is more expensive", "Primary data is collected firsthand, secondary data is from existing sources", "Secondary is more accurate", "They are the same"]', 'Primary data is collected firsthand, secondary data is from existing sources', 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'Why is understanding customer needs important for agribusiness?', 'text', NULL, NULL, 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 2)), 'What should be included in a risk management plan?', 'multiple-choice', '["Only insurance policies", "Risk identification, assessment, mitigation strategies, and monitoring", "Only emergency contacts", "Only financial reserves"]', 'Risk identification, assessment, mitigation strategies, and monitoring', 10),

-- Quiz 3 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'What is the first step in financial planning for agribusiness?', 'multiple-choice', '["Invest in equipment", "Assess current financial situation", "Hire accountants", "Buy land"]', 'Assess current financial situation', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'How does budgeting help agricultural operations?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'What is the formula for calculating return on investment (ROI)?', 'multiple-choice', '["Revenue - Costs", "(Net Profit / Investment) × 100", "Revenue × Costs", "Investment / Revenue"]', '(Net Profit / Investment) × 100', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'Name one source of funding for agribusiness ventures.', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'What is the difference between fixed and variable costs in agriculture?', 'multiple-choice', '["Fixed costs change with production", "Variable costs change with production, fixed costs do not", "They are the same", "Fixed costs are only labor"]', 'Variable costs change with production, fixed costs do not', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'How can farmers protect against financial risks?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'What is a cash flow statement used for?', 'multiple-choice', '["Only showing profits", "Tracking money coming in and going out over time", "Only tax purposes", "Only for investors"]', 'Tracking money coming in and going out over time', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'Why is maintaining financial records important for agribusiness?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'What is the break-even point in business?', 'multiple-choice', '["When profits equal losses", "When total revenue equals total costs", "When sales stop", "When debts are paid"]', 'When total revenue equals total costs', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 3)), 'How can technology help with financial management in agriculture?', 'text', NULL, NULL, 10),

-- Quiz 4 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'What is the primary goal of sustainable agriculture?', 'multiple-choice', '["Maximum short-term profits", "Meeting current needs without compromising future generations", "Only environmental protection", "Only economic growth"]', 'Meeting current needs without compromising future generations', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'How does organic farming benefit the environment?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'Name one water conservation technique used in agriculture.', 'text', NULL, NULL, 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'Why is soil health important for sustainable farming?', 'multiple-choice', '["Only for plant growth", "It affects productivity, water retention, and ecosystem health", "Only for erosion control", "Only for appearance"]', 'It affects productivity, water retention, and ecosystem health', 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'What is climate-smart agriculture?', 'text', NULL, NULL, 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'How can farmers adapt to climate change?', 'multiple-choice', '["Only by moving locations", "Through crop diversification, water management, and resilient practices", "Only with government help", "Only by using more chemicals"]', 'Through crop diversification, water management, and resilient practices', 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'What role does biodiversity play in sustainable agriculture?', 'text', NULL, NULL, 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'How can sustainable practices improve profitability?', 'multiple-choice', '["They cannot", "Through resource efficiency, premium pricing, and long-term viability", "Only through subsidies", "Only for large farms"]', 'Through resource efficiency, premium pricing, and long-term viability', 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'What is regenerative agriculture?', 'text', NULL, NULL, 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 101 AND order_index = 4)), 'Why is sustainable agriculture important for food security?', 'multiple-choice', '["It is not important", "It ensures long-term productive capacity of land", "Only for developed countries", "Only for environmental reasons"]', 'It ensures long-term productive capacity of land', 10);

-- Insert modules for Course 102: Digital Marketing for Agribusiness
INSERT INTO modules (course_id, title, description, order_index) VALUES
(102, 'Digital Marketing Fundamentals', 'Learn the basics of digital marketing and its application in agribusiness.', 1),
(102, 'Social Media Marketing Strategies', 'Master social media platforms and strategies for agricultural businesses.', 2),
(102, 'Content Marketing for Agriculture', 'Create compelling content that engages and converts agricultural audiences.', 3),
(102, 'E-commerce and Online Sales', 'Set up and optimize online sales channels for agricultural products.', 4);

-- Insert lessons for Course 102
INSERT INTO lessons (module_id, title, content, type, duration, order_index) VALUES
-- Module 1 lessons
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Introduction to Digital Marketing', 'Understand the fundamentals of digital marketing and its importance in today''s business landscape.', 'text', '15 min', 1),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Digital Marketing Channels', 'Explore various digital marketing channels and their effectiveness for different business types.', 'video', '20 min', 2),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Building Your Online Presence', 'Learn how to establish a strong online presence for your agribusiness.', 'text', '18 min', 3),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Digital Marketing Strategy Development', 'Develop comprehensive digital marketing strategies tailored for agricultural businesses.', 'video', '22 min', 4),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Measuring Digital Marketing Success', 'Learn how to track and measure the effectiveness of your digital marketing efforts.', 'text', '16 min', 5),

-- Module 2 lessons
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Social Media Platforms Overview', 'Get familiar with major social media platforms and their features.', 'text', '14 min', 1),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Creating Engaging Content', 'Learn how to create content that resonates with agricultural audiences.', 'video', '19 min', 2),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Building Community Engagement', 'Strategies for building and maintaining engaged communities on social media.', 'text', '17 min', 3),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Social Media Advertising', 'Master the art of paid social media advertising for agribusiness.', 'video', '21 min', 4),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Social Media Analytics', 'Track and analyze the performance of your social media marketing efforts.', 'text', '15 min', 5),

-- Module 3 lessons
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Content Marketing Principles', 'Understand the core principles of effective content marketing.', 'text', '16 min', 1),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Blogging for Agribusiness', 'Learn how to create valuable blog content for your agricultural audience.', 'video', '18 min', 2),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Video Content Creation', 'Master the creation of engaging video content for agricultural marketing.', 'text', '20 min', 3),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Email Marketing Strategies', 'Develop effective email marketing campaigns for agribusiness.', 'video', '19 min', 4),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'SEO for Agricultural Websites', 'Optimize your website for search engines to attract more visitors.', 'text', '17 min', 5),

-- Module 4 lessons
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 4), 'Setting Up an E-commerce Store', 'Learn how to set up and configure an online store for agricultural products.', 'text', '18 min', 1),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 4), 'Product Photography and Presentation', 'Master the art of photographing and presenting agricultural products online.', 'video', '16 min', 2),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 4), 'Online Payment Systems', 'Understand different payment options and how to integrate them into your e-commerce platform.', 'text', '15 min', 3),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 4), 'Shipping and Logistics', 'Learn about shipping options and logistics management for online agricultural sales.', 'video', '20 min', 4),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 4), 'Customer Service Excellence', 'Provide outstanding customer service in the digital marketplace.', 'text', '14 min', 5);

-- Insert quizzes for Course 102
INSERT INTO quizzes (module_id, title, description, passing_grade, duration_text) VALUES
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 1), 'Digital Marketing Fundamentals Quiz', 'Test your understanding of digital marketing basics', 7, '10 minutes'),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 2), 'Social Media Marketing Quiz', 'Assess your knowledge of social media marketing strategies', 7, '12 minutes'),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 3), 'Content Marketing Quiz', 'Evaluate your understanding of content marketing principles', 7, '15 minutes'),
((SELECT id FROM modules WHERE course_id = 102 AND order_index = 4), 'E-commerce Quiz', 'Test your knowledge of online sales and e-commerce', 7, '10 minutes');

-- Insert quiz questions for Course 102
INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer, order_index) VALUES
-- Quiz 1 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'What is digital marketing?', 'multiple-choice', '["Only social media", "Marketing using digital channels like websites, email, and social media", "Only email marketing", "Only search engines"]', 'Marketing using digital channels like websites, email, and social media', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'Why is digital marketing important for agribusiness?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'Which digital marketing channel is most effective for reaching local customers?', 'multiple-choice', '["International websites", "Local SEO and Google My Business", "Only social media", "Only email"]', 'Local SEO and Google My Business', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'What is a digital marketing strategy?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'How do you measure the success of digital marketing campaigns?', 'multiple-choice', '["Only by sales revenue", "Using KPIs like website traffic, engagement rates, and conversion rates", "Only by social media followers", "Only by email open rates"]', 'Using KPIs like website traffic, engagement rates, and conversion rates', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'What is the first step in building an online presence?', 'multiple-choice', '["Buy advertising", "Create a professional website", "Post on social media", "Send emails"]', 'Create a professional website', 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'How often should you review your digital marketing strategy?', 'text', NULL, NULL, 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'What role does mobile optimization play in digital marketing?', 'multiple-choice', '["No role", "Limited role", "Critical role as most users access content via mobile", "Only for large businesses"]', 'Critical role as most users access content via mobile', 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'How can digital marketing help small agribusinesses compete?', 'text', NULL, NULL, 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 1)), 'What is the relationship between digital marketing and customer engagement?', 'multiple-choice', '["No relationship", "Indirect relationship", "Direct relationship through interactive content and communication", "Only through sales"]', 'Direct relationship through interactive content and communication', 10),

-- Quiz 2 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'Which social media platform is most popular among farmers?', 'multiple-choice', '["TikTok", "Facebook", "Instagram", "LinkedIn"]', 'Facebook', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'How can social media help agribusiness marketing?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'What type of content performs best on social media for agriculture?', 'multiple-choice', '["Only text posts", "Visual content like photos and videos of farms and products", "Only links", "Only advertisements"]', 'Visual content like photos and videos of farms and products', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'How do you build community engagement on social media?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'What is social media advertising?', 'multiple-choice', '["Free posts only", "Paid promotions to reach larger audiences", "Only organic content", "Only for large companies"]', 'Paid promotions to reach larger audiences', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'Why is social media analytics important?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'How often should you post on social media for agribusiness?', 'multiple-choice', '["Once a month", "3-5 times per week consistently", "Every hour", "Only when you have sales"]', '3-5 times per week consistently', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'What is the best time to post on social media for agricultural audiences?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'How can social media help with customer service?', 'multiple-choice', '["It cannot", "Through direct messaging and public responses", "Only through advertising", "Only for complaints"]', 'Through direct messaging and public responses', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 2)), 'What metrics should you track for social media success?', 'text', NULL, NULL, 10),

-- Quiz 3 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'What is content marketing?', 'multiple-choice', '["Only advertising", "Creating and sharing valuable content to attract and engage audiences", "Only social media posts", "Only email newsletters"]', 'Creating and sharing valuable content to attract and engage audiences', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'Why is blogging important for agribusiness?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'What types of video content work well for agriculture?', 'multiple-choice', '["Only product demonstrations", "Farm tours, cooking tutorials, educational content, and testimonials", "Only advertisements", "Only text overlays"]', 'Farm tours, cooking tutorials, educational content, and testimonials', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'How does email marketing benefit agribusiness?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'What is SEO and why is it important?', 'multiple-choice', '["Search Engine Optimization - helps websites rank higher in search results", "Social Engagement Optimization - only for social media", "Sales Enhancement Operations - only for sales", "Search Engine Operations - only for Google"]', 'Search Engine Optimization - helps websites rank higher in search results', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'How can you create valuable content for agricultural audiences?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'What is the key to successful content marketing?', 'multiple-choice', '["Posting frequently", "Providing genuine value and solving audience problems", "Using complex jargon", "Only promoting products"]', 'Providing genuine value and solving audience problems', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'How does video content engage agricultural audiences?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'What makes email marketing effective for agribusiness?', 'multiple-choice', '["Only promotional emails", "Personalized content, valuable information, and clear calls-to-action", "Only newsletters", "Only for large companies"]', 'Personalized content, valuable information, and clear calls-to-action', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 3)), 'How can SEO help local agribusinesses?', 'text', NULL, NULL, 10),

-- Quiz 4 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'What is the first step in setting up an e-commerce store?', 'multiple-choice', '["Choose products", "Select an e-commerce platform", "Set up payment systems", "Create marketing materials"]', 'Select an e-commerce platform', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'Why is product photography important for online sales?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'What payment systems are commonly used for e-commerce?', 'multiple-choice', '["Only cash on delivery", "Credit cards, PayPal, mobile money, and bank transfers", "Only checks", "Only cryptocurrency"]', 'Credit cards, PayPal, mobile money, and bank transfers', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'How do you handle shipping for agricultural products?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'What is important for customer service in e-commerce?', 'multiple-choice', '["Only fast responses", "Fast responses, clear communication, and problem resolution", "Only low prices", "Only product quality"]', 'Fast responses, clear communication, and problem resolution', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'How can you build trust with online customers?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'What is the role of product descriptions in e-commerce?', 'multiple-choice', '["No role", "Limited role", "Critical for informing customers and improving SEO", "Only for legal requirements"]', 'Critical for informing customers and improving SEO', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'How do you optimize your online store for mobile users?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'What metrics should you track for e-commerce success?', 'multiple-choice', '["Only sales revenue", "Conversion rates, average order value, customer acquisition cost, and return rates", "Only website traffic", "Only social media engagement"]', 'Conversion rates, average order value, customer acquisition cost, and return rates', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 102 AND order_index = 4)), 'How can e-commerce help small agribusinesses grow?', 'text', NULL, NULL, 10);

-- Insert modules for Course 103: Agricultural Technology and Innovation
INSERT INTO modules (course_id, title, description, order_index) VALUES
(103, 'Introduction to Agricultural Technology', 'Explore the fundamentals of agricultural technology and its impact on modern farming.', 1),
(103, 'Precision Agriculture Tools', 'Learn about precision farming technologies and their applications.', 2),
(103, 'IoT and Smart Farming', 'Discover Internet of Things applications in agriculture.', 3),
(103, 'Data Analytics for Agriculture', 'Master data analysis techniques for agricultural decision-making.', 4);

-- Insert lessons for Course 103
INSERT INTO lessons (module_id, title, content, type, duration, order_index) VALUES
-- Module 1 lessons
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'The Evolution of Agricultural Technology', 'Trace the history and development of agricultural technology from traditional to modern methods.', 'text', '16 min', 1),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'Current Agricultural Technology Landscape', 'Overview of current technologies transforming agriculture worldwide.', 'video', '20 min', 2),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'Benefits and Challenges of AgTech', 'Explore the advantages and obstacles in implementing agricultural technology.', 'text', '15 min', 3),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'Future Trends in Agricultural Innovation', 'Look ahead at emerging technologies that will shape the future of farming.', 'video', '18 min', 4),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'Adopting Technology in Small Farms', 'Strategies for small-scale farmers to adopt and benefit from agricultural technology.', 'text', '17 min', 5),

-- Module 2 lessons
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'GPS and GNSS in Agriculture', 'Understanding Global Positioning Systems and their agricultural applications.', 'text', '14 min', 1),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'Drones and Aerial Imaging', 'Learn about drone technology and aerial imaging for farm management.', 'video', '19 min', 2),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'Variable Rate Technology', 'Master variable rate application systems for precision farming.', 'text', '16 min', 3),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'Remote Sensing and Satellite Imagery', 'Explore satellite technology for agricultural monitoring and analysis.', 'video', '21 min', 4),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'Precision Irrigation Systems', 'Learn about advanced irrigation technologies for water conservation.', 'text', '18 min', 5),

-- Module 3 lessons
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'IoT Sensors in Agriculture', 'Understanding Internet of Things sensors and their farming applications.', 'text', '15 min', 1),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'Smart Irrigation Systems', 'Explore automated irrigation systems powered by IoT technology.', 'video', '17 min', 2),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'Automated Climate Control', 'Learn about automated systems for greenhouse and livestock climate management.', 'text', '16 min', 3),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'Livestock Monitoring Technology', 'Discover technologies for monitoring livestock health and behavior.', 'video', '19 min', 4),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'Farm Management Software', 'Master software solutions for comprehensive farm management.', 'text', '20 min', 5),

-- Module 4 lessons
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 4), 'Agricultural Data Collection', 'Learn methods for collecting and managing agricultural data.', 'text', '15 min', 1),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 4), 'Data Analysis Tools for Farmers', 'Explore tools and techniques for analyzing agricultural data.', 'video', '18 min', 2),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 4), 'Predictive Analytics in Agriculture', 'Understand predictive modeling for crop yields and weather forecasting.', 'text', '17 min', 3),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 4), 'Decision Support Systems', 'Learn about decision support systems for agricultural management.', 'video', '19 min', 4),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 4), 'Data Privacy and Security in Agriculture', 'Understand data privacy concerns and security measures for agricultural data.', 'text', '16 min', 5);

-- Insert quizzes for Course 103
INSERT INTO quizzes (module_id, title, description, passing_grade, duration_text) VALUES
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 1), 'Agricultural Technology Fundamentals Quiz', 'Test your understanding of agricultural technology basics', 7, '10 minutes'),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 2), 'Precision Agriculture Quiz', 'Assess your knowledge of precision farming technologies', 7, '12 minutes'),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 3), 'IoT and Smart Farming Quiz', 'Evaluate your understanding of IoT applications in agriculture', 7, '15 minutes'),
((SELECT id FROM modules WHERE course_id = 103 AND order_index = 4), 'Data Analytics Quiz', 'Test your knowledge of agricultural data analysis', 7, '10 minutes');

-- Insert quiz questions for Course 103
INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer, order_index) VALUES
-- Quiz 1 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'What is agricultural technology (AgTech)?', 'multiple-choice', '["Only tractors", "Technology designed to improve agricultural productivity and sustainability", "Only computers", "Only irrigation systems"]', 'Technology designed to improve agricultural productivity and sustainability', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'How has agricultural technology evolved over time?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'What are the main benefits of agricultural technology?', 'multiple-choice', '["Only increased yields", "Increased productivity, reduced costs, improved sustainability, and better decision-making", "Only labor reduction", "Only environmental damage"]', 'Increased productivity, reduced costs, improved sustainability, and better decision-making', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'What challenges do farmers face when adopting new technology?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'What emerging technologies will impact agriculture in the future?', 'multiple-choice', '["Only AI", "AI, robotics, biotechnology, and blockchain", "Only drones", "Only mobile apps"]', 'AI, robotics, biotechnology, and blockchain', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'How can small farmers benefit from agricultural technology?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'What is the role of innovation in agricultural technology?', 'multiple-choice', '["No role", "Limited role", "Critical for solving global food security challenges", "Only for profit"]', 'Critical for solving global food security challenges', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'How does technology help with sustainable agriculture?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'What is precision agriculture?', 'multiple-choice', '["Farming with exact measurements", "Using technology to apply inputs precisely where and when needed", "Only GPS farming", "Only drone farming"]', 'Using technology to apply inputs precisely where and when needed', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 1)), 'Why is agricultural technology important for food security?', 'text', NULL, NULL, 10),

-- Quiz 2 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'How does GPS technology help in precision agriculture?', 'multiple-choice', '["Only for navigation", "Provides accurate positioning for field operations and mapping", "Only for weather forecasting", "Only for irrigation"]', 'Provides accurate positioning for field operations and mapping', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'What can drones be used for in agriculture?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'What is variable rate technology (VRT)?', 'multiple-choice', '["Fixed application rates", "Applying inputs at variable rates based on field conditions", "Only for fertilizers", "Only for pesticides"]', 'Applying inputs at variable rates based on field conditions', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'How does satellite imagery help farmers?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'What is precision irrigation?', 'multiple-choice', '["Watering the entire field equally", "Applying water precisely where and when needed", "Only drip irrigation", "Only sprinkler systems"]', 'Applying water precisely where and when needed', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'How can precision agriculture reduce input costs?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'What sensors are commonly used in precision agriculture?', 'multiple-choice', '["Only soil sensors", "Soil moisture, nutrient, pH, and weather sensors", "Only GPS sensors", "Only drone sensors"]', 'Soil moisture, nutrient, pH, and weather sensors', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'How does remote sensing benefit crop monitoring?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'What is the main advantage of precision irrigation systems?', 'multiple-choice', '["Higher water usage", "Reduced water waste and improved crop yields", "More complex management", "Higher costs only"]', 'Reduced water waste and improved crop yields', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 2)), 'How can farmers get started with precision agriculture?', 'text', NULL, NULL, 10),

-- Quiz 3 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'What is IoT in agriculture?', 'multiple-choice', '["Internet of Tractors", "Internet of Things - connected devices for farm monitoring and control", "Internet of Tomatoes", "Internet of Tools"]', 'Internet of Things - connected devices for farm monitoring and control', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'How do IoT sensors help with irrigation management?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'What is smart irrigation?', 'multiple-choice', '["Manual irrigation", "Automated irrigation based on sensor data and weather conditions", "Only timer-based irrigation", "Only flood irrigation"]', 'Automated irrigation based on sensor data and weather conditions', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'How can IoT help with climate control in greenhouses?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'What livestock monitoring technologies exist?', 'multiple-choice', '["Only visual observation", "GPS collars, health sensors, and automated feeding systems", "Only scales", "Only manual counting"]', 'GPS collars, health sensors, and automated feeding systems', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'What is farm management software?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'How does IoT improve farm efficiency?', 'multiple-choice', '["Reduces efficiency", "Provides real-time data and automation for better decision-making", "Increases labor requirements", "Only for large farms"]', 'Provides real-time data and automation for better decision-making', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'What are the challenges of implementing IoT in agriculture?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'How can small farmers afford IoT technology?', 'multiple-choice', '["They cannot", "Start with basic sensors and scale up, look for affordable solutions", "Only government subsidies", "Only for large corporations"]', 'Start with basic sensors and scale up, look for affordable solutions', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 3)), 'What is the future of IoT in agriculture?', 'text', NULL, NULL, 10),

-- Quiz 4 questions
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'Why is data collection important in modern agriculture?', 'multiple-choice', '["Only for record-keeping", "Enables data-driven decision making and optimization", "Only for compliance", "Only for selling data"]', 'Enables data-driven decision making and optimization', 1),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'What tools can farmers use for data analysis?', 'text', NULL, NULL, 2),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'What is predictive analytics in agriculture?', 'multiple-choice', '["Guessing future events", "Using historical data and algorithms to forecast outcomes", "Only weather prediction", "Only crop yield prediction"]', 'Using historical data and algorithms to forecast outcomes', 3),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'How do decision support systems help farmers?', 'text', NULL, NULL, 4),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'What data privacy concerns exist in agricultural technology?', 'multiple-choice', '["No concerns", "Data ownership, security breaches, and misuse of farm data", "Only GPS data", "Only financial data"]', 'Data ownership, security breaches, and misuse of farm data', 5),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'How can farmers protect their agricultural data?', 'text', NULL, NULL, 6),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'What is the role of AI in agricultural data analytics?', 'multiple-choice', '["No role", "Processes large datasets and identifies patterns for insights", "Only for robots", "Only for automation"]', 'Processes large datasets and identifies patterns for insights', 7),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'How can data analytics improve crop yields?', 'text', NULL, NULL, 8),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'What is the biggest challenge in agricultural data analytics?', 'multiple-choice', '["Too much data", "Data quality, integration, and farmer training", "Too little data", "Only cost"]', 'Data quality, integration, and farmer training', 9),
((SELECT id FROM quizzes WHERE module_id = (SELECT id FROM modules WHERE course_id = 103 AND order_index = 4)), 'How will data analytics shape the future of farming?', 'text', NULL, NULL, 10);