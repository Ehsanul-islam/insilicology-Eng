import Navbar from '@/components/Navbar';
import SkilltoriHero from '@/components/SkilltoriHero';
import Features from '@/components/Features';
import FeaturedCourses from '@/components/FeaturedCourses';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="LearnCraft - Professional Skills Development Platform"
        description="Master in-demand skills with expert-led courses, hands-on projects, and industry-recognized certificates. Join 50,000+ active learners on LearnCraft."
        url="/"
        type="website"
        tags={['online learning', 'professional development', 'courses', 'skills training', 'certification']}
      />
      <Navbar />
      <main>
        <SkilltoriHero />
        <Features />
        <FeaturedCourses />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
