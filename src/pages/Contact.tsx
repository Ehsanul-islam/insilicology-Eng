import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Message sent!',
      description: "We'll get back to you as soon as possible.",
    });

    form.reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@insilicology.com',
      link: 'mailto:info@insilicology.com',
    },
    {
      icon: MessageSquare,
      label: 'WhatsApp / Telegram',
      value: '+8801617082936',
      link: 'https://wa.me/8801617082936',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Brussels, Belgium',
      link: null,
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact Us - Get in Touch | insilicology"
        description="Have questions? We're here to help. Contact insilicology for inquiries about courses, partnerships, or support. We'd love to hear from you!"
        url="/contact"
        type="website"
        tags={['contact', 'support', 'get in touch', 'customer service']}
      />
      <Navbar />

      <main className="pt-16">
        {/* Hero Section - Communication & Connection Theme */}
        <section className="relative bg-[#0a1f1f] text-white pt-2 pb-8 overflow-hidden border-b border-white/5">
          {/* Velvet Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

          {/* Ambient Glows: Emerald & Cyan */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[50%] -left-[10%] w-[80%] h-[100%] bg-emerald-600/15 blur-[130px] rounded-full animate-pulse" />
            <div className="absolute top-[20%] -right-[20%] w-[60%] h-[90%] bg-cyan-600/20 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
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
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[9px] font-bold text-emerald-200/80 mb-3 backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  CONNECT WITH US
                </div>

                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter leading-tight">
                  Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-cyan-400 to-emerald-200 bg-[length:200%_auto] animate-gradient-x">Touch</span>
                </h1>

                <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed font-medium">
                  Have a question or want to work together? We'd love to hear from you.
                </p>
              </motion.div>

              {/* Right Column: Compact Horizontal Stats */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  { label: 'Response Time', value: '24h' },
                  { label: 'Support Channels', value: '4+' },
                  { label: 'Countries', value: '25+' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px] p-2 md:p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all hover:scale-105 group backdrop-blur-sm"
                  >
                    <span className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">{stat.value}</span>
                    <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6">Send us a message</h2>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="How can we help you?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us more about your inquiry..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full btn-accent"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            'Sending...'
                          ) : (
                            <>
                              Send Message
                              <Send className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        const content = (
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold mb-1">{info.label}</p>
                              <p className="text-muted-foreground text-sm">{info.value}</p>
                            </div>
                          </div>
                        );

                        return info.link ? (
                          <a
                            key={index}
                            href={info.link}
                            className="block hover:bg-muted/50 -m-2 p-2 rounded-lg transition-colors"
                          >
                            {content}
                          </a>
                        ) : (
                          <div key={index}>{content}</div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-3">Quick Response</h3>
                    <p className="text-white/90 mb-4">
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                    <p className="text-white/80 text-sm">
                      For urgent matters, please call us directly.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="bg-muted/50 py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
                <div className="aspect-video">
                  <iframe
                    title="Insilicology location near Brussels, Belgium"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=4.3780%2C50.7780%2C4.4590%2C50.8270&layer=mapnik&marker=50.8025%2C4.4185"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Brussels, Belgium</p>
                      <p className="text-sm text-muted-foreground">Quiet outer Brussels area</p>
                    </div>
                  </div>
                  <a
                    href="https://www.openstreetmap.org/?mlat=50.8025&mlon=4.4185#map=13/50.8025/4.4185"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View larger map
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
