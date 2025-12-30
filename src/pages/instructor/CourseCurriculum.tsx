import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CourseCurriculum = () => {
    const { courseId } = useParams();

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Curriculum editor for course {courseId} is under construction.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseCurriculum;
