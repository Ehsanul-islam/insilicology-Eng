import Navbar from '@/components/Navbar';
<<<<<<< HEAD
import SkilltoriHero from '@/components/SkilltoriHero';
import Features from '@/components/Features';
import FeaturedCourses from '@/components/FeaturedCourses';
=======
>>>>>>> c32b8299aad385db5480326ac979d55ab6213aa2
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead
        title="LearnCraft - Professional Skills Development Platform"
        description="Master in-demand skills with expert-led courses, hands-on projects, and industry-recognized certificates."
        url="/"
        type="website"
        tags={['online learning', 'professional development', 'courses', 'skills training', 'certification']}
      />
      <Navbar />
<<<<<<< HEAD
      <main>
        <SkilltoriHero />
        <Features />
        <FeaturedCourses />
      </main>
=======
      <main className="flex-1" />
>>>>>>> c32b8299aad385db5480326ac979d55ab6213aa2
      <Footer />
    </div>
  );
};

export default Index;
