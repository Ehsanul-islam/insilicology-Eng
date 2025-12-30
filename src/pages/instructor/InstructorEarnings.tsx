import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, BookOpen } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const InstructorEarnings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        pendingPayout: 0,
        totalStudents: 0,
        courseSales: [] as any[]
    });

    useEffect(() => {
        if (user) {
            fetchEarningsData();
        }
    }, [user]);

    const fetchEarningsData = async () => {
        try {
            setLoading(true);

            // Fetch courses and their enrollments to calculate "earnings"
            // Note: In a real app, you'd have a transactions table. 
            // Here we'll estimate based on enrollments * price.

            const { data: courses, error } = await supabase
                .from('courses')
                .select(`
                    id,
                    title,
                    price_regular,
                    created_at,
                    enrollments (count)
                `)
                .eq('instructor_id', user!.id);

            if (error) throw error;

            let total = 0;
            let students = 0;
            const salesData = courses?.map(course => {
                const enrollmentCount = course.enrollments[0]?.count || 0;
                const price = course.price_regular || 0;
                const earnings = enrollmentCount * price;

                total += earnings;
                students += enrollmentCount;

                return {
                    id: course.id,
                    title: course.title,
                    price: price,
                    students: enrollmentCount,
                    earnings: earnings
                };
            }) || [];

            setStats({
                totalEarnings: total,
                pendingPayout: total * 0.7, // Assuming 70% rev share
                totalStudents: students,
                courseSales: salesData
            });

        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
                <p className="text-muted-foreground">Overview of your revenue and student enrollments</p>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Gross revenue from all courses
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Net Earnings (Est.)</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">${stats.pendingPayout.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Estimated 70% instructor share
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                                <p className="text-xs text-muted-foreground">
                                    Across {stats.courseSales.length} courses
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Course Performance</CardTitle>
                            <CardDescription>Breakdown of earnings by course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Course Name</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Students</TableHead>
                                        <TableHead className="text-right">Total Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.courseSales.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No sales data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        stats.courseSales.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    {course.title}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {course.price > 0 ? `$${course.price}` : <Badge variant="secondary">Free</Badge>}
                                                </TableCell>
                                                <TableCell className="text-right">{course.students}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    ${course.earnings.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default InstructorEarnings;
