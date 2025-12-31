import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';

interface CourseTagsProps {
    tags: string[];
}

const CourseTags = ({ tags }: CourseTagsProps) => {
    if (!tags || tags.length === 0) return null;

    return (
        <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="px-6 lg:px-8 py-2 flex items-center gap-3">
                <Tag className="w-5 h-5 text-primary shrink-0" />
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 text-[12px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTags;
