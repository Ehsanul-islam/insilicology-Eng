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
        {/* Hero Section - Growth & Opportunity Theme */}
        <section className="relative bg-[#1a0a0f] text-white pt-16 pb-8 overflow-hidden border-b border-white/5">
          {/* Velvet Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

          {/* Ambient Glows: Rose & Orange */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[50%] -left-[10%] w-[80%] h-[100%] bg-rose-600/15 blur-[130px] rounded-full animate-pulse" />
            <div className="absolute top-[20%] -right-[20%] w-[60%] h-[90%] bg-orange-600/20 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
          </div>

          <div className="container-custom relative z-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
              {/* Left Column: Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/5 border border-rose-500/20 text-[9px] font-bold text-rose-200/80 mb-3 backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                  </span>
                  JOIN OUR TEAM
                </div>

                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter leading-tight">
                  Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-orange-400 to-rose-200 bg-[length:200%_auto] animate-gradient-x">Future</span>
                </h1>

                <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed font-medium mb-6">
                  Join our mission to make quality education accessible to everyone, everywhere.
                </p>

                <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white">
                  View Open Positions
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              {/* Right Column: Compact Horizontal Stats */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  { label: 'Open Positions', value: openPositions.length || '6+' },
                  { label: 'Team Members', value: '50+' },
                  { label: 'Locations', value: '3+' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px] p-2 md:p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all hover:scale-105 group backdrop-blur-sm"
                  >
                    <span className="text-lg md:text-xl font-bold text-white group-hover:text-rose-400 transition-colors tracking-tight">{stat.value}</span>
                    <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
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
