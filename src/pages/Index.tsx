import Navbar from '@/components/Navbar';
import UnifiedHero from '@/components/common/UnifiedHero';
import HomeServices from '@/components/HomeServices';
import Features from '@/components/Features';
import FeaturedCourses from '@/components/FeaturedCourses';
import CaseStudies from '@/components/CaseStudies';
import ImpactStats from '@/components/ImpactStats';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead
        title="insilicology - Professional Skills Development Platform"
        description="Master in-demand skills with expert-led courses, hands-on projects, and industry-recognized certificates."
        url="/"
        type="website"
        tags={['online learning', 'professional development', 'courses', 'skills training', 'certification']}
      />
      <Navbar />
      <main className="flex-1">
        <UnifiedHero variant="skilltori" />
        <HomeServices />
        <FeaturedCourses />
        <CaseStudies />
        <ImpactStats />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
