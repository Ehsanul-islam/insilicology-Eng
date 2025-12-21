-- Seed demo portfolio projects
-- Run this script to populate the portfolio_projects table with sample data

-- Insert demo portfolio projects
INSERT INTO portfolio_projects (
  title,
  slug,
  summary,
  description,
  client_name,
  country,
  duration_text,
  team_size,
  category,
  hero_image_url,
  technologies,
  services,
  results,
  challenges,
  solutions,
  featured,
  status,
  created_at,
  updated_at
) VALUES
(
  'FinTech Banking Application',
  'fintech-banking-app',
  'A modern digital banking platform with real-time transactions, AI-powered insights, and seamless user experience.',
  '## Project Overview

Developed a comprehensive digital banking solution that revolutionizes how customers manage their finances. The platform integrates cutting-edge security features, real-time transaction processing, and AI-powered financial insights to provide users with a superior banking experience.

### Key Features

- **Real-time Transactions**: Instant money transfers and payments
- **AI-Powered Insights**: Personalized financial recommendations
- **Multi-factor Authentication**: Bank-grade security
- **Mobile-first Design**: Seamless experience across all devices',
  'GlobalBank Inc.',
  'United States',
  '6 months',
  '12 members',
  'web-development',
  '/placeholder.svg',
  '["React", "Node.js", "PostgreSQL", "AWS", "Redis", "Docker", "Kubernetes"]'::jsonb,
  '["Full-Stack Development", "Cloud Infrastructure", "Security Implementation", "UI/UX Design", "DevOps & Deployment", "Quality Assurance"]'::jsonb,
  '[
    {"metric": "3M+", "description": "Active users within first year"},
    {"metric": "99.9%", "description": "Uptime achieved"},
    {"metric": "50%", "description": "Reduction in transaction time"},
    {"metric": "4.8/5", "description": "User satisfaction rating"}
  ]'::jsonb,
  '[
    {
      "title": "Security & Compliance",
      "description": "Implementing bank-grade security while maintaining user-friendly experience and meeting regulatory requirements."
    },
    {
      "title": "Real-time Processing",
      "description": "Building infrastructure to handle millions of concurrent transactions with minimal latency."
    },
    {
      "title": "Legacy System Integration",
      "description": "Seamlessly integrating with existing banking systems while building modern microservices architecture."
    }
  ]'::jsonb,
  '[
    {
      "title": "Multi-layer Security",
      "description": "Implemented end-to-end encryption, biometric authentication, and AI-powered fraud detection."
    },
    {
      "title": "Scalable Architecture",
      "description": "Built microservices architecture with auto-scaling capabilities and distributed caching."
    },
    {
      "title": "API Gateway",
      "description": "Developed robust API layer to bridge modern and legacy systems with real-time synchronization."
    }
  ]'::jsonb,
  true,
  'published',
  now() - interval '60 days',
  now() - interval '60 days'
),
(
  'Healthcare Management System',
  'healthcare-management',
  'Comprehensive healthcare platform connecting patients, doctors, and hospitals with telemedicine capabilities.',
  '## Project Overview

Built a comprehensive healthcare management system that streamlines patient care, appointment scheduling, and telemedicine consultations. The platform connects patients, healthcare providers, and hospitals in a unified ecosystem.',
  'HealthCare Partners',
  'Canada',
  '8 months',
  '15 members',
  'web-development',
  '/placeholder.svg',
  '["Vue.js", "Python", "MongoDB", "Azure", "WebRTC", "Redis"]'::jsonb,
  '["Full-Stack Development", "Telemedicine Integration", "HIPAA Compliance", "UI/UX Design", "Cloud Deployment", "Quality Assurance"]'::jsonb,
  '[
    {"metric": "50K+", "description": "Registered patients"},
    {"metric": "500+", "description": "Healthcare providers"},
    {"metric": "10K+", "description": "Telemedicine consultations"},
    {"metric": "95%", "description": "Patient satisfaction"}
  ]'::jsonb,
  '[
    {
      "title": "HIPAA Compliance",
      "description": "Ensuring all patient data is handled according to strict healthcare regulations."
    },
    {
      "title": "Telemedicine Integration",
      "description": "Building reliable video consultation features with high-quality streaming."
    }
  ]'::jsonb,
  '[
    {
      "title": "Secure Infrastructure",
      "description": "Implemented HIPAA-compliant data storage and transmission protocols."
    },
    {
      "title": "WebRTC Integration",
      "description": "Built robust video consultation system with screen sharing and recording capabilities."
    }
  ]'::jsonb,
  true,
  'published',
  now() - interval '45 days',
  now() - interval '45 days'
),
(
  'E-Commerce Marketplace Platform',
  'ecommerce-marketplace',
  'Multi-vendor marketplace with advanced search, real-time inventory management, and AI recommendations.',
  '## Project Overview

Created a scalable multi-vendor e-commerce marketplace that enables thousands of sellers to list products and manage orders efficiently. The platform features AI-powered product recommendations and real-time inventory synchronization.',
  'ShopHub',
  'United Kingdom',
  '5 months',
  '10 members',
  'web-development',
  '/placeholder.svg',
  '["Next.js", "Stripe", "Redis", "Vercel", "PostgreSQL", "Elasticsearch"]'::jsonb,
  '["Frontend Development", "Payment Integration", "Search Optimization", "Performance Tuning", "Cloud Deployment"]'::jsonb,
  '[
    {"metric": "1000+", "description": "Active vendors"},
    {"metric": "100K+", "description": "Products listed"},
    {"metric": "$5M+", "description": "Monthly GMV"},
    {"metric": "2s", "description": "Average page load time"}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  false,
  'published',
  now() - interval '30 days',
  now() - interval '30 days'
),
(
  'AI-Powered Fitness Tracking App',
  'fitness-tracking-app',
  'Mobile fitness application with personalized workout plans, nutrition tracking, and social features.',
  '## Project Overview

Developed a comprehensive fitness tracking mobile application that combines AI-powered workout recommendations with social networking features. Users can track their workouts, monitor nutrition, and connect with fitness enthusiasts.',
  'FitLife Technologies',
  'Australia',
  '7 months',
  '14 members',
  'mobile-apps',
  '/placeholder.svg',
  '["React Native", "Firebase", "TensorFlow", "GraphQL", "MongoDB"]'::jsonb,
  '["Mobile Development", "AI/ML Integration", "Backend Development", "UI/UX Design", "Cloud Infrastructure"]'::jsonb,
  '[
    {"metric": "500K+", "description": "App downloads"},
    {"metric": "4.7/5", "description": "App store rating"},
    {"metric": "250K+", "description": "Active monthly users"},
    {"metric": "85%", "description": "User retention rate"}
  ]'::jsonb,
  '[
    {
      "title": "Personalization",
      "description": "Creating workout plans that adapt to individual user progress and goals."
    },
    {
      "title": "Performance",
      "description": "Ensuring smooth experience even with complex ML models running on mobile devices."
    }
  ]'::jsonb,
  '[
    {
      "title": "TensorFlow Lite",
      "description": "Implemented on-device ML models for real-time workout form analysis."
    },
    {
      "title": "Optimized Architecture",
      "description": "Built efficient data sync and caching system for offline functionality."
    }
  ]'::jsonb,
  true,
  'published',
  now() - interval '20 days',
  now() - interval '20 days'
),
(
  'Predictive Analytics Dashboard',
  'predictive-analytics-dashboard',
  'Real-time analytics platform with machine learning models for business intelligence and forecasting.',
  '## Project Overview

Built a powerful analytics dashboard that combines real-time data visualization with predictive machine learning models to provide actionable business insights and accurate forecasting.',
  'DataVision Corp',
  'Singapore',
  '4 months',
  '8 members',
  'data-science',
  '/placeholder.svg',
  '["Python", "TensorFlow", "D3.js", "Docker", "FastAPI", "TimescaleDB"]'::jsonb,
  '["Data Engineering", "ML Model Development", "Frontend Visualization", "Backend API Development", "DevOps"]'::jsonb,
  '[
    {"metric": "10TB+", "description": "Data processed monthly"},
    {"metric": "92%", "description": "Prediction accuracy"},
    {"metric": "<500ms", "description": "Query response time"},
    {"metric": "50+", "description": "ML models deployed"}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  false,
  'published',
  now() - interval '15 days',
  now() - interval '15 days'
),
(
  'Interactive Educational Platform',
  'educational-platform',
  'Engaging online learning platform with gamification, live classes, and adaptive learning paths.',
  '## Project Overview

Created an innovative educational platform that makes online learning engaging through gamification, live interactive classes, and AI-powered adaptive learning paths that adjust to each student''s pace.',
  'EduTech Solutions',
  'India',
  '9 months',
  '18 members',
  'web-development',
  '/placeholder.svg',
  '["Angular", "NestJS", "WebRTC", "Kubernetes", "PostgreSQL", "Redis"]'::jsonb,
  '["Full-Stack Development", "Video Streaming", "Gamification Design", "Cloud Architecture", "Quality Assurance"]'::jsonb,
  '[
    {"metric": "200K+", "description": "Registered students"},
    {"metric": "1000+", "description": "Available courses"},
    {"metric": "95%", "description": "Course completion rate"},
    {"metric": "4.6/5", "description": "Platform rating"}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  false,
  'published',
  now() - interval '10 days',
  now() - interval '10 days'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  updated_at = now();

