import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const stats = [
    {
      title: 'Courses Enrolled',
      value: '3',
      icon: BookOpen,
      change: '+2 this month',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Certificates Earned',
      value: '1',
      icon: Award,
      change: '+1 this month',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Learning Hours',
      value: '24.5',
      icon: Clock,
      change: '+8.2 this week',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Current Streak',
      value: '7 days',
      icon: TrendingUp,
      change: 'Keep it up!',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      progress: 65,
      thumbnail: '/placeholder.svg',
      nextLesson: 'State Management Patterns',
      instructor: 'Sarah Johnson',
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      progress: 30,
      thumbnail: '/placeholder.svg',
      nextLesson: 'Color Theory Basics',
      instructor: 'Michael Chen',
    },
    {
      id: 3,
      title: 'Python for Data Science',
      progress: 90,
      thumbnail: '/placeholder.svg',
      nextLesson: 'Final Project Review',
      instructor: 'Dr. Emily Roberts',
    },
  ];

  const recentActivity = [
    { action: 'Completed lesson', course: 'Advanced React', time: '2 hours ago' },
    { action: 'Earned certificate', course: 'JavaScript Basics', time: '1 day ago' },
    { action: 'Started course', course: 'Python for Data Science', time: '3 days ago' },
    { action: 'Completed quiz', course: 'UI/UX Design', time: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SEOHead
        title="Dashboard - LearnCraft"
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
              <span className="text-lg font-bold gradient-text">LearnCraft</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile/settings">
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          {stats.map((stat) => {
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
          })}
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
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {course.instructor}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Next: {course.nextLesson}
                        </p>
                        <Button size="sm" asChild>
                          <Link to={`/courses/${course.id}`}>Continue</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Achievements
                </CardTitle>
                <CardDescription>Your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: '🎯', title: 'First Course', unlocked: true },
                    { icon: '🔥', title: '7 Day Streak', unlocked: true },
                    { icon: '📚', title: '5 Courses', unlocked: false },
                    { icon: '🏆', title: 'Top Student', unlocked: false },
                  ].map((achievement, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg text-center ${
                        achievement.unlocked
                          ? 'bg-accent/10 border-2 border-accent'
                          : 'bg-secondary/50 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <p className="text-xs font-medium">{achievement.title}</p>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.course}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
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