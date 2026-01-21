import { supabase } from '@/integrations/supabase/client';

export const seedDemoCourse = async () => {
  console.log('🌱 Seeding demo course...');

  const courseData = {
    slug: 'complete-web-development-bootcamp',
    title: 'Complete Web Development Bootcamp 2025',
    description: `Master modern web development from scratch! This comprehensive bootcamp takes you from absolute beginner to professional developer. You'll learn HTML, CSS, JavaScript, React, Node.js, and more through hands-on projects and real-world applications.

**What makes this course special?**

Our curriculum is designed by industry experts and updated regularly to reflect the latest trends and best practices. You won't just watch videos – you'll build real projects that you can add to your portfolio.

Throughout the course, you'll work on:
- A personal portfolio website
- An e-commerce application
- A social media dashboard
- A full-stack blog platform

Join thousands of students who have transformed their careers through this bootcamp!`,
    status: 'published' as const,
    course_type: 'live' as const,
    difficulty: 'beginner' as const,
    featured: true,
    upcoming: false,
    certificate: true,
    duration_text: '12 weeks',
    module_count: 24,
    price_regular: 15000,
    price_offer: 7999,
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    countdown_end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    poster_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop',
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_name: 'Sarah Rahman',
    instructor_title: 'Senior Software Engineer & Educator',
    instructor_bio: 'Sarah is a passionate educator with 10+ years of experience in web development. She has worked at top tech companies including Google and Microsoft, and has helped over 50,000 students worldwide launch their careers in tech. Her teaching style focuses on practical, project-based learning that prepares students for real-world challenges.',
    instructor_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    stats: { students: 12500, community: 'Active Discord', support: '24/7 Help' },
    topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Deployment'],
    learning_outcomes: [
      'Build responsive websites from scratch using HTML5 and CSS3',
      'Master JavaScript fundamentals and advanced concepts',
      'Create dynamic web applications with React.js',
      'Build RESTful APIs with Node.js and Express',
      'Work with databases using MongoDB and PostgreSQL',
      'Deploy applications to cloud platforms',
      'Implement authentication and authorization',
      'Write clean, maintainable, and tested code',
    ],
    requirements: [
      'Basic computer literacy',
      'A computer with internet connection',
      'Willingness to learn and practice daily',
      'No prior programming experience required',
    ],
    whats_included: [
      '24+ hours of HD video content',
      '100+ coding exercises',
      '12 real-world projects',
      'Lifetime access to course updates',
      'Certificate of completion',
      'Private Discord community access',
      '1-on-1 mentorship sessions',
      'Resume review and career guidance',
    ],
    why_join: [
      'Learn from industry experts with real-world experience',
      'Build a portfolio with 12+ professional projects',
      'Join a community of 50,000+ developers',
      'Get personalized feedback on your code',
      'Career support and job placement assistance',
      'Money-back guarantee if not satisfied',
    ],
    roadmap: [
      { title: 'Foundation', description: 'HTML, CSS basics, and your first webpage' },
      { title: 'Styling Mastery', description: 'Advanced CSS, Flexbox, Grid, and animations' },
      { title: 'JavaScript Core', description: 'Variables, functions, DOM manipulation' },
      { title: 'Advanced JS', description: 'ES6+, async/await, APIs, and modules' },
      { title: 'React Fundamentals', description: 'Components, state, props, and hooks' },
      { title: 'React Advanced', description: 'Context, Redux, routing, and optimization' },
      { title: 'Backend with Node', description: 'Express, REST APIs, and middleware' },
      { title: 'Database Integration', description: 'MongoDB, PostgreSQL, and ORMs' },
      { title: 'Authentication', description: 'JWT, OAuth, and security best practices' },
      { title: 'Testing', description: 'Unit tests, integration tests, and TDD' },
      { title: 'Deployment', description: 'CI/CD, Docker, and cloud platforms' },
      { title: 'Career Prep', description: 'Portfolio, resume, and interview prep' },
    ],
    comparison_features: [
      { feature: 'Live instructor-led sessions', us: true, others: false },
      { feature: '1-on-1 mentorship', us: true, others: false },
      { feature: 'Real-world projects', us: true, others: true },
      { feature: 'Job placement assistance', us: true, others: false },
      { feature: 'Lifetime access', us: true, others: true },
      { feature: 'Certificate of completion', us: true, others: true },
      { feature: '24/7 community support', us: true, others: false },
      { feature: 'Code review by experts', us: true, others: false },
      { feature: 'Updated curriculum', us: true, others: false },
      { feature: 'Money-back guarantee', us: true, others: false },
    ],
    target_audience: [
      { title: 'Complete Beginners', description: 'No coding experience? Perfect! We start from the very basics and build up your skills step by step.', icon: 'GraduationCap' },
      { title: 'Career Changers', description: 'Looking to switch to tech? This bootcamp provides all the skills you need for a new career.', icon: 'Briefcase' },
      { title: 'Students', description: 'College students who want practical skills that complement their academic learning.', icon: 'BookOpen' },
      { title: 'Freelancers', description: 'Build the skills to take on web development projects and grow your freelance business.', icon: 'Laptop' },
      { title: 'Entrepreneurs', description: 'Learn to build your own web applications without depending on expensive developers.', icon: 'Rocket' },
      { title: 'Developers', description: 'Experienced developers looking to update their skills with modern frameworks and tools.', icon: 'Code' },
    ],
    value_breakdown: [
      { item: '24+ Hours of HD Video Content', original_price: 5000 },
      { item: '100+ Coding Exercises', original_price: 3000 },
      { item: '12 Real-World Projects', original_price: 8000 },
      { item: 'Private Discord Community', original_price: 2000 },
      { item: '1-on-1 Mentorship Sessions', original_price: 5000 },
      { item: 'Certificate of Completion', original_price: 1000 },
      { item: 'Resume Review & Career Guide', original_price: 3000 },
      { item: 'Lifetime Updates', original_price: 2000 },
    ],
    testimonials: [
      { name: 'Rahim Ahmed', role: 'Frontend Developer at Tech Corp', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', text: 'This course completely changed my career. I went from zero coding knowledge to landing a job as a frontend developer in just 4 months!', rating: 5 },
      { name: 'Fatima Khan', role: 'Freelance Web Developer', text: 'The projects in this course helped me build an amazing portfolio. I now have a steady stream of freelance clients.', rating: 5 },
      { name: 'Arif Hassan', role: 'Full Stack Developer', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', text: 'Sarah is an incredible instructor. She explains complex concepts in a way that\'s easy to understand.', rating: 5 },
      { name: 'Nadia Islam', role: 'Software Engineer at Startup', text: 'The 1-on-1 mentorship was invaluable. Having an expert review my code helped me improve so much faster.', rating: 4 },
    ],
    faq: [
      { question: 'Do I need any prior programming experience?', answer: 'Not at all! This course is designed for complete beginners. We start from the very basics and gradually build up to advanced concepts. All you need is a computer, internet connection, and the willingness to learn.' },
      { question: 'How long do I have access to the course?', answer: 'You get lifetime access to all course materials, including any future updates. Once you enroll, you can learn at your own pace and revisit the content whenever you need a refresher.' },
      { question: 'What if I get stuck or have questions?', answer: 'We have a thriving Discord community where you can ask questions and get help from instructors and fellow students. We also offer 1-on-1 mentorship sessions for personalized guidance.' },
      { question: 'Will I get a certificate after completing the course?', answer: 'Yes! Upon successful completion of the course and projects, you will receive a verified certificate that you can add to your LinkedIn profile and resume.' },
      { question: 'Is there a money-back guarantee?', answer: 'Absolutely! We offer a 7-day money-back guarantee. If you\'re not satisfied with the course for any reason, just let us know within 7 days of enrollment and we\'ll provide a full refund.' },
      { question: 'Can I access the course on mobile devices?', answer: 'Yes, our platform is fully responsive. You can watch videos and complete exercises on your phone, tablet, or computer.' },
      { question: 'How is this different from free YouTube tutorials?', answer: 'While YouTube has great content, our course offers a structured curriculum, hands-on projects, personalized feedback, mentorship, and a supportive community. These elements are crucial for actually landing a job in tech.' },
      { question: 'Do you help with job placement?', answer: 'Yes! We offer career support including resume reviews, portfolio feedback, interview preparation, and connections to our hiring partner network.' },
    ],
    payment_methods: ['bkash', 'nagad', 'bank_transfer'],
    payment_instructions: `**Payment Instructions:**

1. **bKash/Nagad:** Send payment to 01XXXXXXXXX (Personal)
2. **Bank Transfer:** 
   - Bank: ABC Bank
   - Account: 1234567890
   - Branch: Dhaka Main

After payment, upload your payment screenshot during enrollment. Your enrollment will be confirmed within 24 hours.`,
    enrollment_form_fields: [
      { id: 'phone', label: 'Phone Number', type: 'phone', required: true, placeholder: '01XXXXXXXXX' },
      { id: 'education', label: 'Educational Background', type: 'select', required: true, options: ['High School', 'Undergraduate', 'Graduate', 'Postgraduate', 'Other'] },
      { id: 'experience', label: 'Programming Experience', type: 'select', required: true, options: ['Complete Beginner', 'Some Experience', 'Intermediate', 'Advanced'] },
      { id: 'goals', label: 'What do you hope to achieve?', type: 'textarea', required: false, placeholder: 'Tell us about your learning goals...' },
    ],
  };

  // First, try to delete existing course with same slug
  const { error: deleteError } = await supabase
    .from('courses')
    .delete()
    .eq('slug', courseData.slug);

  if (deleteError) {
    console.log('Note: Could not delete existing course (may not exist):', deleteError.message);
  }

  // Insert the course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert(courseData)
    .select()
    .single();

  if (courseError) {
    console.error('❌ Error inserting course:', courseError);
    throw courseError;
  }

  console.log('✅ Course created:', course.title);

  // Add lessons
  const lessons = [
    { title: 'Module 1: Introduction to Web Development', description: 'Welcome to the course! Learn about the web development landscape.', lesson_order: 1, duration_minutes: 15, is_preview: true, video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { title: 'Module 1: Setting Up Your Development Environment', description: 'Install VS Code, Git, and essential extensions.', lesson_order: 2, duration_minutes: 20, is_preview: true, video_url: null },
    { title: 'Module 1: Your First HTML Page', description: 'Create your very first webpage from scratch.', lesson_order: 3, duration_minutes: 25, is_preview: false, video_url: null },
    { title: 'Module 2: HTML Structure and Semantics', description: 'Learn about HTML5 semantic elements.', lesson_order: 4, duration_minutes: 30, is_preview: false, video_url: null },
    { title: 'Module 2: Forms and Input Elements', description: 'Build interactive forms with validation.', lesson_order: 5, duration_minutes: 35, is_preview: false, video_url: null },
    { title: 'Module 3: CSS Fundamentals', description: 'Styling basics - selectors, properties, values.', lesson_order: 6, duration_minutes: 40, is_preview: false, video_url: null },
    { title: 'Module 3: Flexbox Layout', description: 'Master modern CSS layouts with Flexbox.', lesson_order: 7, duration_minutes: 45, is_preview: false, video_url: null },
    { title: 'Module 3: CSS Grid', description: 'Build complex layouts with CSS Grid.', lesson_order: 8, duration_minutes: 40, is_preview: false, video_url: null },
    { title: 'Module 4: JavaScript Basics', description: 'Variables, data types, and operators.', lesson_order: 9, duration_minutes: 35, is_preview: false, video_url: null },
    { title: 'Module 4: Functions and Scope', description: 'Understanding functions in JavaScript.', lesson_order: 10, duration_minutes: 40, is_preview: false, video_url: null },
    { title: 'Module 4: DOM Manipulation', description: 'Interact with the webpage using JavaScript.', lesson_order: 11, duration_minutes: 45, is_preview: false, video_url: null },
    { title: 'Module 5: React Introduction', description: 'Getting started with React.js.', lesson_order: 12, duration_minutes: 50, is_preview: false, video_url: null },
    { title: 'Module 5: Components and Props', description: 'Building reusable React components.', lesson_order: 13, duration_minutes: 45, is_preview: false, video_url: null },
    { title: 'Module 5: State and Hooks', description: 'Managing state in React applications.', lesson_order: 14, duration_minutes: 50, is_preview: false, video_url: null },
    { title: 'Module 6: Node.js Fundamentals', description: 'Introduction to server-side JavaScript.', lesson_order: 15, duration_minutes: 40, is_preview: false, video_url: null },
    { title: 'Module 6: Express.js Framework', description: 'Building APIs with Express.', lesson_order: 16, duration_minutes: 45, is_preview: false, video_url: null },
    { title: 'Module 7: Database Integration', description: 'Working with MongoDB and PostgreSQL.', lesson_order: 17, duration_minutes: 50, is_preview: false, video_url: null },
    { title: 'Module 7: Authentication & Security', description: 'Implementing secure user authentication.', lesson_order: 18, duration_minutes: 55, is_preview: false, video_url: null },
    { title: 'Module 8: Deployment & DevOps', description: 'Deploy your applications to the cloud.', lesson_order: 19, duration_minutes: 45, is_preview: false, video_url: null },
    { title: 'Module 8: Career Preparation', description: 'Resume, portfolio, and interview prep.', lesson_order: 20, duration_minutes: 60, is_preview: false, video_url: null },
  ];

  const lessonsWithCourseId = lessons.map((lesson) => ({
    ...lesson,
    course_id: course.id,
    is_active: true,
  }));

  const { error: lessonsError } = await supabase
    .from('lessons')
    .insert(lessonsWithCourseId);

  if (lessonsError) {
    console.error('❌ Error inserting lessons:', lessonsError);
    throw lessonsError;
  }

  console.log('✅ Lessons created:', lessons.length);
  console.log('🎉 Demo course seeded successfully!');
  console.log(`📍 View at: /academy/${courseData.slug}`);

  return course;
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).seedDemoCourse = seedDemoCourse;
}

