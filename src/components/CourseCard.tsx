import { Link } from 'react-router-dom';
import { Clock, Users, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  price: number;
}

const CourseCard = ({
  id,
  title,
  description,
  instructor,
  duration,
  students,
  rating,
  level,
  category,
  thumbnail,
  price,
}: CourseCardProps) => {
  const levelColors = {
    Beginner: 'bg-green-100 text-green-800 border-green-200',
    Intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    Advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <Card className="card-hover overflow-hidden group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4">
            <Badge className={levelColors[level]}>{level}</Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div>
          <Link to={`/courses/${id}`}>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">{rating}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">by {instructor}</p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">${price}</span>
          {price < 100 && (
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
        <Button className="btn-primary" asChild>
          <Link to={`/courses/${id}`}>Enroll Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
