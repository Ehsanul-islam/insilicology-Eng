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
      <Card className="cursor-pointer overflow-hidden hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg border-0">
        {isExternalLink(program.registration_link) ? (
          <a
            href={program.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <CardContent className="p-0">
              <div className="relative w-full h-[280px] overflow-hidden">
                <img
                  src={program.image_url}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(program.start_date), 'MMM d, yyyy')}
                </p>
              </div>
            </CardContent>
          </a>
        ) : (
          <Link to={program.registration_link} className="block">
            <CardContent className="p-0">
              <div className="relative w-full h-[280px] overflow-hidden">
                <img
                  src={program.image_url}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(program.start_date), 'MMM d, yyyy')}
                </p>
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
          <Skeleton className="w-full h-[280px]" />
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px] mx-auto relative">
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
              <Card className="cursor-pointer overflow-hidden hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg border-0">
                {isExternalLink(program.registration_link) ? (
                  <a
                    href={program.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <CardContent className="p-0">
                      <div className="relative w-full h-[280px] overflow-hidden">
                        <img
                          src={program.image_url}
                          alt={program.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {program.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(program.start_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </CardContent>
                  </a>
                ) : (
                  <Link to={program.registration_link} className="block">
                    <CardContent className="p-0">
                      <div className="relative w-full h-[280px] overflow-hidden">
                        <img
                          src={program.image_url}
                          alt={program.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {program.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(program.start_date), 'MMM d, yyyy')}
                        </p>
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

