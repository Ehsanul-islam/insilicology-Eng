/**
 * SEOHead Component Usage Examples
 * 
 * This file demonstrates how to use the SEOHead component across different pages
 */

import SEOHead from './SEOHead';

// ============= Example 1: Homepage =============
export const HomepageExample = () => (
  <SEOHead
    title="LearnCraft - Professional Skills Development Platform"
    description="Master in-demand skills with expert-led courses, hands-on projects, and industry-recognized certificates. Join 50,000+ active learners on LearnCraft."
    url="/"
    type="website"
    tags={['online learning', 'professional development', 'courses', 'skills training', 'certification']}
  />
);

// ============= Example 2: Course Listing Page =============
export const CourseListingExample = () => (
  <SEOHead
    title="All Courses - Learn Web Development, Data Science & More"
    description="Browse our complete catalog of expert-led online courses. Master web development, data science, UI/UX design, and more."
    url="/courses"
    type="website"
    tags={['online courses', 'web development', 'data science', 'ui ux design']}
  />
);

// ============= Example 3: Individual Course Page =============
export const CourseDetailExample = () => (
  <SEOHead
    title="Complete Web Development Bootcamp"
    description="Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive full-stack development course. Join 12,500 students."
    url="/courses/1"
    type="course"
    image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80"
    author="Sarah Johnson"
    tags={['web development', 'javascript', 'react', 'node.js', 'full-stack']}
    course={{
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive full-stack development course.',
      duration: '40 hours',
      level: 'Beginner',
      price: 49,
      currency: 'USD'
    }}
  />
);

// ============= Example 4: Blog Article =============
export const BlogArticleExample = () => (
  <SEOHead
    title="10 Essential Web Development Skills for 2024"
    description="Discover the most in-demand web development skills that employers are looking for in 2024. Stay ahead of the curve with these essential technologies."
    url="/blog/web-dev-skills-2024"
    type="article"
    image="/blog-images/web-dev-skills-hero.jpg"
    author="LearnCraft Team"
    publishedTime="2024-01-15T10:00:00Z"
    tags={['web development', 'career advice', 'programming', 'technology trends']}
  />
);

// ============= Example 5: About Page =============
export const AboutPageExample = () => (
  <SEOHead
    title="About LearnCraft - Empowering Learners Worldwide"
    description="Learn about LearnCraft's mission to provide accessible, high-quality education to professionals worldwide. Meet our team and discover our story."
    url="/about"
    type="website"
    tags={['about us', 'education', 'online learning platform']}
  />
);

// ============= Example 6: Search Results Page =============
export const SearchResultsExample = () => (
  <SEOHead
    title="Search Results for 'React' - LearnCraft"
    description="Find the best React courses and tutorials on LearnCraft. Browse courses from beginner to advanced levels."
    url="/search?q=react"
    type="website"
    tags={['react', 'javascript', 'frontend development']}
  />
);

// ============= Example 7: Instructor Profile =============
export const InstructorProfileExample = () => (
  <SEOHead
    title="Sarah Johnson - Web Development Instructor | LearnCraft"
    description="Meet Sarah Johnson, expert web development instructor with 10+ years of experience. Explore her courses and join 50,000+ students learning with her."
    url="/instructors/sarah-johnson"
    type="website"
    author="Sarah Johnson"
    tags={['instructor', 'web development', 'online teaching']}
  />
);
