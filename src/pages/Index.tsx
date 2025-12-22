import Navbar from '@/components/Navbar';
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
      <main className="flex-1" />
      <Footer />
    </div>
  );
};

export default Index;
