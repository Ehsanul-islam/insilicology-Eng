import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUpcomingPrograms } from '@/hooks/useUpcomingPrograms';
import { format } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const UpcomingPrograms = () => {
  const { fetchUpcomingPrograms, error } = useUpcomingPrograms();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await fetchUpcomingPrograms();
      console.log('Upcoming Programs loaded:', data);
      setPrograms(data || []);
    } catch (err) {
      console.error('Error loading upcoming programs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show error state for debugging
  if (error) {
    console.error('Upcoming Programs Error:', error);
  }

  // Don't render if no programs (silently hide)
  if (!loading && programs.length === 0) {
    console.log('No upcoming programs found. Make sure:');
    console.log('1. Database migration has been run');
    console.log('2. Seed data has been inserted');
    console.log('3. Programs are set to "published" status');
    return null; // Hide from users, only log to console
  }

  // Check if link is external
  const isExternalLink = (link: string) => {
    return link.startsWith('http://') || link.startsWith('https://');
  };

  // Render single program (no carousel)
  if (!loading && programs.length === 1) {
    const program = programs[0];
    const ProgramCard = ({ program }: { program: any }) => (
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 border-0">
        {isExternalLink(program.registration_link) ? (
          <a
            href={program.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <CardContent className="p-0">
              <div className="relative w-full h-[320px] overflow-hidden">
                <img
                  src={program.image_url}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                {/* Floating glassmorphism badge - bottom right */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-md bg-gray-900/70 border border-white/20 shadow-xl transition-all duration-300 group-hover:bg-gray-900/80">
                  {/* Green pulsing dot with ping ripple */}
                  <div className="relative flex-shrink-0">
                    <span className="flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 animate-pulse"></span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm text-white leading-tight line-clamp-1">
                      {program.title}
                    </h3>
                    <p className="text-xs text-gray-300 font-medium">
                      {format(new Date(program.start_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </a>
        ) : (
          <Link to={program.registration_link} className="block">
            <CardContent className="p-0">
              <div className="relative w-full h-[320px] overflow-hidden">
                <img
                  src={program.image_url}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                {/* Floating glassmorphism badge - bottom right */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-md bg-gray-900/70 border border-white/20 shadow-xl transition-all duration-300 group-hover:bg-gray-900/80">
                  {/* Green pulsing dot with ping ripple */}
                  <div className="relative flex-shrink-0">
                    <span className="flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 animate-pulse"></span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm text-white leading-tight line-clamp-1">
                      {program.title}
                    </h3>
                    <p className="text-xs text-gray-300 font-medium">
                      {format(new Date(program.start_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        )}
      </Card>
    );

    return (
      <div className="w-full max-w-[520px] mx-auto">
        <ProgramCard program={program} />
      </div>
    );
  }

  // Render carousel for multiple programs
  if (loading) {
    return (
      <div className="w-full max-w-[520px] mx-auto">
        <Card className="overflow-hidden">
          <Skeleton className="w-full h-[238px]" />
          <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-1.5" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[442px] mx-auto relative">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {programs.map((program) => {
            const ProgramCard = () => (
              <Card className="group cursor-pointer overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 border-0">
                {isExternalLink(program.registration_link) ? (
                  <a
                    href={program.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <CardContent className="p-0">
                      <div className="relative w-full h-[320px] overflow-hidden">
                        <img
                          src={program.image_url}
                          alt={program.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Floating glassmorphism badge - bottom right */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-md bg-gray-900/70 border border-white/20 shadow-xl transition-all duration-300 group-hover:bg-gray-900/80">
                          {/* Green pulsing dot with ping ripple */}
                          <div className="relative flex-shrink-0">
                            <span className="flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 animate-pulse"></span>
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-bold text-sm text-white leading-tight line-clamp-1">
                              {program.title}
                            </h3>
                            <p className="text-xs text-gray-300 font-medium">
                              {format(new Date(program.start_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </a>
                ) : (
                  <Link to={program.registration_link} className="block">
                    <CardContent className="p-0">
                      <div className="relative w-full h-[320px] overflow-hidden">
                        <img
                          src={program.image_url}
                          alt={program.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Floating glassmorphism badge - bottom right */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-md bg-gray-900/70 border border-white/20 shadow-xl transition-all duration-300 group-hover:bg-gray-900/80">
                          {/* Green pulsing dot with ping ripple */}
                          <div className="relative flex-shrink-0">
                            <span className="flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 animate-pulse"></span>
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-bold text-sm text-white leading-tight line-clamp-1">
                              {program.title}
                            </h3>
                            <p className="text-xs text-gray-300 font-medium">
                              {format(new Date(program.start_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                )}
              </Card>
            );

            return (
              <CarouselItem key={program.id}>
                <ProgramCard />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {programs.length > 1 && (
          <>
            <CarouselPrevious className="-left-12 hidden lg:flex" />
            <CarouselNext className="-right-12 hidden lg:flex" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default UpcomingPrograms;

