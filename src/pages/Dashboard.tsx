import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Trophy,
  GraduationCap,
  Settings,
  LogOut,
  User,
  BarChart3,
  Loader2,
  ExternalLink,
  Video,
  Gift,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import NotificationBell from '@/components/NotificationBell';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { loading, stats, enrolledCourses, certificates, recentActivity } = useDashboardData();
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    const checkCoupon = async () => {
      if (!user) return;
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: usageData } = await supabase
          .from('coupon_usages' as any)
          .select('*')
          .eq('user_id', user.id)
          .eq('coupon_code', 'WELCOME100')
          .maybeSingle();

        if (!usageData) {
          setShowCoupon(true);
        }
      } catch (err) {
        console.error("Error checking coupon:", err);
      }
    };

    checkCoupon();
  }, [user]);

  const statsCards = [
    {
      title: 'Courses Enrolled',
      value: stats.enrolledCourses.toString(),
      icon: BookOpen,
      change: stats.enrolledCourses > 0 ? 'Active learning' : 'Start learning today',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Completed Courses',
      value: stats.completedCourses.toString(),
      icon: Trophy,
      change: stats.completedCourses > 0 ? 'Great progress!' : 'Complete your first course',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Certificates Earned',
      value: stats.certificates.toString(),
      icon: Award,
      change: stats.certificates > 0 ? 'Keep achieving!' : 'Earn your first certificate',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Hours Watched',
      value: stats.totalHours.toString(),
      icon: Clock,
      change: stats.totalHours > 0 ? 'Time well spent' : 'Start watching',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SEOHead
        title="Dashboard - Zymios"
        description="Track your learning progress and manage your courses"
        url="/dashboard"
      />

      {/* Header with Navigation */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Zymios</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
              <NotificationBell />
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile/settings">
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <LogOut className="w-4 h-4" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey where you left off
          </p>
        </div>

        {/* Special Welcome Gift Coupon */}
        {showCoupon && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-2 border-pink-500/20 animate-fade-in relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gift className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Gift className="w-6 h-6 text-pink-500" />
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                  Special Welcome Gift!
                </h2>
              </div>
              <p className="text-muted-foreground mb-4 max-w-xl">
                As a new student, here's a special gift to get you started. Use this coupon code for <strong>$5 OFF</strong> your first course enrollment!
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-background border-2 border-dashed border-pink-300 rounded-lg px-4 py-2 font-mono text-lg font-bold tracking-wider text-pink-600 select-all cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText('WELCOME100');
                    // Could add toast here if sonner was imported
                  }}>
                  WELCOME100
                </div>
                <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-pink-500/20">
                  <Link to="/courses">Redeem Now</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))
                ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You haven't enrolled in any courses yet
                    </p>
                    <Button asChild>
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                ) : (
                  enrolledCourses.map((course) => {
                    const isLiveFuture = course.course_type === 'live' && course.start_date && new Date(course.start_date) > new Date();

                    return (
                      <div
                        key={course.id}
                        className="flex gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <img
                          src={course.thumbnail || '/placeholder.svg'}
                          alt={course.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{course.title}</h4>
                            </div>
                            {!isLiveFuture && (
                              <span className="text-sm font-medium text-primary">
                                {course.progress}%
                              </span>
                            )}
                          </div>

                          {isLiveFuture ? (
                            <div className="space-y-3 mt-2">
                              <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Starts Soon: {new Date(course.start_date!).toLocaleDateString()}
                              </div>
                              {course.whatsapp_group_link && (
                                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-8" asChild>
                                  <a href={course.whatsapp_group_link} target="_blank" rel="noopener noreferrer">
                                    Join WhatsApp Group
                                  </a>
                                </Button>
                              )}
                            </div>
                          ) : (
                            <>
                              <Progress value={course.progress} className="h-2" />
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  {course.progress === 100 ? 'Completed!' : 'In Progress'}
                                </p>
                                <Button size="sm" asChild>
                                  <Link to={`/learn/${course.slug}`}>
                                    {course.progress === 100 ? 'Review' : 'Continue'}
                                  </Link>
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Certificates Showcase */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  My Certificates
                </CardTitle>
                <CardDescription>Your earned credentials</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-32" />
                ) : certificates.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No certificates yet</p>
                    <p className="text-sm text-muted-foreground">
                      Complete a course to earn your first certificate
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.slice(0, 4).map((cert) => (
                      <Link
                        key={cert.id}
                        to={`/verify-certificate?hash=${cert.verificationHash}`}
                        className="group p-4 rounded-lg border-2 border-border hover:border-accent transition-colors bg-gradient-to-br from-accent/5 to-primary/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Award className="w-8 h-8 text-accent" />
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                        <h4 className="font-semibold mb-1 line-clamp-1">{cert.courseName}</h4>
                        <p className="text-xs text-muted-foreground">
                          Completed: {new Date(cert.completionDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          #{cert.certificateNumber}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
                {certificates.length > 4 && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/my-certificates">View All Certificates</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="animate-fade-in">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-cyan-500 rounded-full mx-auto flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user?.user_metadata?.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile/settings">Edit Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-48" />
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.course}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/my-certificates">
                    <Award className="w-4 h-4 mr-2" />
                    My Certificates
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/my-sessions">
                    <Video className="w-4 h-4 mr-2" />
                    Live Sessions
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/courses">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/profile/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;