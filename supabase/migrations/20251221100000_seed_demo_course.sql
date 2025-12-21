-- Seed Demo Course for Testing CourseDetail Page Layout
-- This creates a comprehensive course with all fields populated

INSERT INTO public.courses (
  id,
  slug,
  title,
  description,
  status,
  course_type,
  difficulty,
  featured,
  upcoming,
  certificate,
  duration_text,
  module_count,
  price_regular,
  price_offer,
  start_date,
  countdown_end_date,
  poster_url,
  promo_video_url,
  instructor_name,
  instructor_title,
  instructor_bio,
  instructor_photo,
  stats,
  topics,
  learning_outcomes,
  requirements,
  whats_included,
  why_join,
  roadmap,
  comparison_features,
  target_audience,
  value_breakdown,
  testimonials,
  faq,
  payment_methods,
  payment_instructions,
  enrollment_form_fields
) VALUES (
  gen_random_uuid(),
  'complete-web-development-bootcamp',
  'Complete Web Development Bootcamp 2025',
  'Master modern web development from scratch! This comprehensive bootcamp takes you from absolute beginner to professional developer. You''ll learn HTML, CSS, JavaScript, React, Node.js, and more through hands-on projects and real-world applications.

**What makes this course special?**

Our curriculum is designed by industry experts and updated regularly to reflect the latest trends and best practices. You won''t just watch videos – you''ll build real projects that you can add to your portfolio.

Throughout the course, you''ll work on:
- A personal portfolio website
- An e-commerce application
- A social media dashboard
- A full-stack blog platform

Join thousands of students who have transformed their careers through this bootcamp!',
  'published',
  'live',
  'beginner',
  true,
  false,
  true,
  '12 weeks',
  24,
  15000,
  7999,
  (CURRENT_DATE + INTERVAL '7 days')::date,
  (CURRENT_DATE + INTERVAL '3 days')::timestamp,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Sarah Rahman',
  'Senior Software Engineer & Educator',
  'Sarah is a passionate educator with 10+ years of experience in web development. She has worked at top tech companies including Google and Microsoft, and has helped over 50,000 students worldwide launch their careers in tech. Her teaching style focuses on practical, project-based learning that prepares students for real-world challenges.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  '{"students": 12500, "community": "Active Discord", "support": "24/7 Help"}',
  '["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git", "Deployment"]',
  '[
    "Build responsive websites from scratch using HTML5 and CSS3",
    "Master JavaScript fundamentals and advanced concepts",
    "Create dynamic web applications with React.js",
    "Build RESTful APIs with Node.js and Express",
    "Work with databases using MongoDB and PostgreSQL",
    "Deploy applications to cloud platforms",
    "Implement authentication and authorization",
    "Write clean, maintainable, and tested code"
  ]',
  '[
    "Basic computer literacy",
    "A computer with internet connection",
    "Willingness to learn and practice daily",
    "No prior programming experience required"
  ]',
  '[
    "24+ hours of HD video content",
    "100+ coding exercises",
    "12 real-world projects",
    "Lifetime access to course updates",
    "Certificate of completion",
    "Private Discord community access",
    "1-on-1 mentorship sessions",
    "Resume review and career guidance"
  ]',
  '[
    "Learn from industry experts with real-world experience",
    "Build a portfolio with 12+ professional projects",
    "Join a community of 50,000+ developers",
    "Get personalized feedback on your code",
    "Career support and job placement assistance",
    "Money-back guarantee if not satisfied"
  ]',
  '[
    {"title": "Foundation", "description": "HTML, CSS basics, and your first webpage"},
    {"title": "Styling Mastery", "description": "Advanced CSS, Flexbox, Grid, and animations"},
    {"title": "JavaScript Core", "description": "Variables, functions, DOM manipulation"},
    {"title": "Advanced JS", "description": "ES6+, async/await, APIs, and modules"},
    {"title": "React Fundamentals", "description": "Components, state, props, and hooks"},
    {"title": "React Advanced", "description": "Context, Redux, routing, and optimization"},
    {"title": "Backend with Node", "description": "Express, REST APIs, and middleware"},
    {"title": "Database Integration", "description": "MongoDB, PostgreSQL, and ORMs"},
    {"title": "Authentication", "description": "JWT, OAuth, and security best practices"},
    {"title": "Testing", "description": "Unit tests, integration tests, and TDD"},
    {"title": "Deployment", "description": "CI/CD, Docker, and cloud platforms"},
    {"title": "Career Prep", "description": "Portfolio, resume, and interview prep"}
  ]',
  '[
    {"feature": "Live instructor-led sessions", "us": true, "others": false},
    {"feature": "1-on-1 mentorship", "us": true, "others": false},
    {"feature": "Real-world projects", "us": true, "others": true},
    {"feature": "Job placement assistance", "us": true, "others": false},
    {"feature": "Lifetime access", "us": true, "others": true},
    {"feature": "Certificate of completion", "us": true, "others": true},
    {"feature": "24/7 community support", "us": true, "others": false},
    {"feature": "Code review by experts", "us": true, "others": false},
    {"feature": "Updated curriculum", "us": true, "others": false},
    {"feature": "Money-back guarantee", "us": true, "others": false}
  ]',
  '[
    {"title": "Complete Beginners", "description": "No coding experience? Perfect! We start from the very basics and build up your skills step by step.", "icon": "GraduationCap"},
    {"title": "Career Changers", "description": "Looking to switch to tech? This bootcamp provides all the skills you need for a new career.", "icon": "Briefcase"},
    {"title": "Students", "description": "College students who want practical skills that complement their academic learning.", "icon": "BookOpen"},
    {"title": "Freelancers", "description": "Build the skills to take on web development projects and grow your freelance business.", "icon": "Laptop"},
    {"title": "Entrepreneurs", "description": "Learn to build your own web applications without depending on expensive developers.", "icon": "Rocket"},
    {"title": "Developers", "description": "Experienced developers looking to update their skills with modern frameworks and tools.", "icon": "Code"}
  ]',
  '[
    {"item": "24+ Hours of HD Video Content", "original_price": 5000},
    {"item": "100+ Coding Exercises", "original_price": 3000},
    {"item": "12 Real-World Projects", "original_price": 8000},
    {"item": "Private Discord Community", "original_price": 2000},
    {"item": "1-on-1 Mentorship Sessions", "original_price": 5000},
    {"item": "Certificate of Completion", "original_price": 1000},
    {"item": "Resume Review & Career Guide", "original_price": 3000},
    {"item": "Lifetime Updates", "original_price": 2000}
  ]',
  '[
    {"name": "Rahim Ahmed", "role": "Frontend Developer at Tech Corp", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "text": "This course completely changed my career. I went from zero coding knowledge to landing a job as a frontend developer in just 4 months!", "rating": 5},
    {"name": "Fatima Khan", "role": "Freelance Web Developer", "text": "The projects in this course helped me build an amazing portfolio. I now have a steady stream of freelance clients.", "rating": 5},
    {"name": "Arif Hassan", "role": "Full Stack Developer", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "text": "Sarah is an incredible instructor. She explains complex concepts in a way that''s easy to understand.", "rating": 5},
    {"name": "Nadia Islam", "role": "Software Engineer at Startup", "text": "The 1-on-1 mentorship was invaluable. Having an expert review my code helped me improve so much faster.", "rating": 5}
  ]',
  '[
    {"question": "Do I need any prior programming experience?", "answer": "Not at all! This course is designed for complete beginners. We start from the very basics and gradually build up to advanced concepts. All you need is a computer, internet connection, and the willingness to learn."},
    {"question": "How long do I have access to the course?", "answer": "You get lifetime access to all course materials, including any future updates. Once you enroll, you can learn at your own pace and revisit the content whenever you need a refresher."},
    {"question": "What if I get stuck or have questions?", "answer": "We have a thriving Discord community where you can ask questions and get help from instructors and fellow students. We also offer 1-on-1 mentorship sessions for personalized guidance."},
    {"question": "Will I get a certificate after completing the course?", "answer": "Yes! Upon successful completion of the course and projects, you will receive a verified certificate that you can add to your LinkedIn profile and resume."},
    {"question": "Is there a money-back guarantee?", "answer": "Absolutely! We offer a 7-day money-back guarantee. If you''re not satisfied with the course for any reason, just let us know within 7 days of enrollment and we''ll provide a full refund."},
    {"question": "Can I access the course on mobile devices?", "answer": "Yes, our platform is fully responsive. You can watch videos and complete exercises on your phone, tablet, or computer."},
    {"question": "How is this different from free YouTube tutorials?", "answer": "While YouTube has great content, our course offers a structured curriculum, hands-on projects, personalized feedback, mentorship, and a supportive community. These elements are crucial for actually landing a job in tech."},
    {"question": "Do you help with job placement?", "answer": "Yes! We offer career support including resume reviews, portfolio feedback, interview preparation, and connections to our hiring partner network."}
  ]',
  '["bkash", "nagad", "bank_transfer"]',
  '**Payment Instructions:**

1. **bKash/Nagad:** Send payment to 01XXXXXXXXX (Personal)
2. **Bank Transfer:** 
   - Bank: ABC Bank
   - Account: 1234567890
   - Branch: Dhaka Main

After payment, upload your payment screenshot during enrollment. Your enrollment will be confirmed within 24 hours.',
  '[
    {"id": "phone", "label": "Phone Number", "type": "phone", "required": true, "placeholder": "01XXXXXXXXX"},
    {"id": "education", "label": "Educational Background", "type": "select", "required": true, "options": ["High School", "Undergraduate", "Graduate", "Postgraduate", "Other"]},
    {"id": "experience", "label": "Programming Experience", "type": "select", "required": true, "options": ["Complete Beginner", "Some Experience", "Intermediate", "Advanced"]},
    {"id": "goals", "label": "What do you hope to achieve?", "type": "textarea", "required": false, "placeholder": "Tell us about your learning goals..."}
  ]'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  course_type = EXCLUDED.course_type,
  difficulty = EXCLUDED.difficulty,
  featured = EXCLUDED.featured,
  upcoming = EXCLUDED.upcoming,
  certificate = EXCLUDED.certificate,
  duration_text = EXCLUDED.duration_text,
  module_count = EXCLUDED.module_count,
  price_regular = EXCLUDED.price_regular,
  price_offer = EXCLUDED.price_offer,
  start_date = EXCLUDED.start_date,
  countdown_end_date = EXCLUDED.countdown_end_date,
  poster_url = EXCLUDED.poster_url,
  promo_video_url = EXCLUDED.promo_video_url,
  instructor_name = EXCLUDED.instructor_name,
  instructor_title = EXCLUDED.instructor_title,
  instructor_bio = EXCLUDED.instructor_bio,
  instructor_photo = EXCLUDED.instructor_photo,
  stats = EXCLUDED.stats,
  topics = EXCLUDED.topics,
  learning_outcomes = EXCLUDED.learning_outcomes,
  requirements = EXCLUDED.requirements,
  whats_included = EXCLUDED.whats_included,
  why_join = EXCLUDED.why_join,
  roadmap = EXCLUDED.roadmap,
  comparison_features = EXCLUDED.comparison_features,
  target_audience = EXCLUDED.target_audience,
  value_breakdown = EXCLUDED.value_breakdown,
  testimonials = EXCLUDED.testimonials,
  faq = EXCLUDED.faq,
  payment_methods = EXCLUDED.payment_methods,
  payment_instructions = EXCLUDED.payment_instructions,
  enrollment_form_fields = EXCLUDED.enrollment_form_fields,
  updated_at = NOW();

-- Also add some sample lessons for the curriculum section
INSERT INTO public.lessons (id, course_id, title, description, lesson_order, duration_minutes, is_preview, is_active, video_url)
SELECT 
  gen_random_uuid(),
  c.id,
  lesson.title,
  lesson.description,
  lesson.order_num,
  lesson.duration,
  lesson.is_preview,
  true,
  lesson.video_url
FROM public.courses c
CROSS JOIN (VALUES 
  ('Module 1: Introduction to Web Development', 'Welcome to the course! Learn about the web development landscape.', 1, 15, true, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  ('Module 1: Setting Up Your Development Environment', 'Install VS Code, Git, and essential extensions.', 2, 20, true, NULL),
  ('Module 1: Your First HTML Page', 'Create your very first webpage from scratch.', 3, 25, false, NULL),
  ('Module 2: HTML Structure and Semantics', 'Learn about HTML5 semantic elements.', 4, 30, false, NULL),
  ('Module 2: Forms and Input Elements', 'Build interactive forms with validation.', 5, 35, false, NULL),
  ('Module 3: CSS Fundamentals', 'Styling basics - selectors, properties, values.', 6, 40, false, NULL),
  ('Module 3: Flexbox Layout', 'Master modern CSS layouts with Flexbox.', 7, 45, false, NULL),
  ('Module 3: CSS Grid', 'Build complex layouts with CSS Grid.', 8, 40, false, NULL),
  ('Module 4: JavaScript Basics', 'Variables, data types, and operators.', 9, 35, false, NULL),
  ('Module 4: Functions and Scope', 'Understanding functions in JavaScript.', 10, 40, false, NULL),
  ('Module 4: DOM Manipulation', 'Interact with the webpage using JavaScript.', 11, 45, false, NULL),
  ('Module 5: React Introduction', 'Getting started with React.js.', 12, 50, false, NULL),
  ('Module 5: Components and Props', 'Building reusable React components.', 13, 45, false, NULL),
  ('Module 5: State and Hooks', 'Managing state in React applications.', 14, 50, false, NULL),
  ('Module 6: Node.js Fundamentals', 'Introduction to server-side JavaScript.', 15, 40, false, NULL),
  ('Module 6: Express.js Framework', 'Building APIs with Express.', 16, 45, false, NULL),
  ('Module 7: Database Integration', 'Working with MongoDB and PostgreSQL.', 17, 50, false, NULL),
  ('Module 7: Authentication & Security', 'Implementing secure user authentication.', 18, 55, false, NULL),
  ('Module 8: Deployment & DevOps', 'Deploy your applications to the cloud.', 19, 45, false, NULL),
  ('Module 8: Career Preparation', 'Resume, portfolio, and interview prep.', 20, 60, false, NULL)
) AS lesson(title, description, order_num, duration, is_preview, video_url)
WHERE c.slug = 'complete-web-development-bootcamp'
ON CONFLICT DO NOTHING;

