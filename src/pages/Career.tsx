import { motion } from 'framer-motion';
import { Briefcase, Users, TrendingUp, Heart, Globe, Zap, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Career = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Learning',
      description: 'We believe in continuous growth and encourage everyone to pursue their curiosity.',
    },
    {
      icon: Users,
      title: 'Collaborative Culture',
      description: 'Work with talented individuals who are passionate about making a difference.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Clear paths for advancement with mentorship and professional development programs.',
    },
    {
      icon: Globe,
      title: 'Remote Friendly',
      description: 'Work from anywhere with flexible schedules and a strong remote-first culture.',
    },
    {
      icon: Zap,
      title: 'Innovation Focus',
      description: 'Experiment with cutting-edge technologies and bring your creative ideas to life.',
    },
    {
      icon: Heart,
      title: 'Work-Life Balance',
      description: 'Competitive benefits, unlimited PTO, and a supportive work environment.',
    },
  ];

  const openPositions = [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and scale our learning platform with React, Node.js, and cloud technologies.',
    },
    {
      id: '2',
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create intuitive and beautiful user experiences for millions of learners worldwide.',
    },
    {
      id: '3',
      title: 'Content Creator',
      department: 'Content',
      location: 'Remote',
      type: 'Contract',
      description: 'Develop engaging course content and help learners achieve their goals.',
    },
    {
      id: '4',
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Hybrid',
      type: 'Full-time',
      description: 'Lead growth initiatives and build our brand across multiple channels.',
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Maintain and optimize our cloud infrastructure and deployment pipelines.',
    },
    {
      id: '6',
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our users succeed and provide exceptional customer support.',
    },
  ];

  const benefits = [
    'Competitive salary and equity',
    'Comprehensive health insurance',
    'Unlimited PTO',
    'Professional development budget',
    'Home office stipend',
    'Latest equipment and tools',
    'Quarterly team retreats',
    'Wellness programs',
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Careers - Join Our Team | LearnCraft"
        description="Join LearnCraft and help shape the future of online education. Explore exciting career opportunities in a dynamic, innovative environment."
        url="/career"
        type="website"
        tags={['careers', 'jobs', 'hiring', 'work with us', 'team']}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Briefcase className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Build the Future of Learning
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Join our mission to make quality education accessible to everyone, everywhere.
              </p>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Why Join LearnCraft?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're building a company where talented people can do their best work and make a real impact.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 bg-muted/30">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Open Positions</h2>
              <p className="text-xl text-muted-foreground">
                Find your next opportunity and grow with us
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-4">
              {openPositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {position.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">
                            {position.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{position.department}</Badge>
                            <Badge variant="outline">{position.location}</Badge>
                            <Badge variant="outline">{position.type}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="md:shrink-0">
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">
                Don't see a role that fits? We're always looking for talented people!
              </p>
              <Button variant="outline" asChild>
                <Link to="/contact">Send Us Your Resume</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-4 text-center">Benefits & Perks</h2>
              <p className="text-xl text-muted-foreground text-center mb-12">
                We invest in our team's success and well-being
              </p>
              <Card>
                <CardContent className="p-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-dark to-primary text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join our team and help millions of people achieve their learning goals.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  View Open Roles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Career;
