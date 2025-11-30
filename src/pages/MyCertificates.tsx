import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Download, Share2, ExternalLink, ArrowLeft, Calendar } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const MyCertificates = () => {
  const certificates = [
    {
      id: 1,
      courseName: 'JavaScript Fundamentals',
      completionDate: 'March 15, 2024',
      certificateNumber: 'CERT-2024-001234',
      instructor: 'Sarah Johnson',
      hours: 40,
      thumbnail: '/placeholder.svg',
    },
  ];

  const inProgressCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      progress: 65,
      estimatedCompletion: '2 weeks',
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      progress: 30,
      estimatedCompletion: '1 month',
    },
    {
      id: 3,
      title: 'Python for Data Science',
      progress: 90,
      estimatedCompletion: '3 days',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SEOHead
        title="My Certificates - LearnCraft"
        description="View and download your course completion certificates"
        url="/my-certificates"
      />

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">LearnCraft</span>
            </Link>

            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Award className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Certificates</h1>
              <p className="text-muted-foreground">
                View and manage your earned certificates
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Award className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{certificates.length}</p>
                    <p className="text-sm text-muted-foreground">Earned Certificates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{inProgressCourses.length}</p>
                    <p className="text-sm text-muted-foreground">Courses In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">40</p>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Earned Certificates */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Earned Certificates</CardTitle>
                <CardDescription>
                  Congratulations on completing these courses!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="relative overflow-hidden rounded-lg border border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 p-6 hover:shadow-lg transition-shadow"
                      >
                        {/* Certificate Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-accent text-accent-foreground">
                            Verified
                          </Badge>
                        </div>

                        {/* Certificate Content */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-accent rounded-lg">
                              <Award className="w-8 h-8 text-accent-foreground" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-1">
                                {cert.courseName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Instructor: {cert.instructor}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Completion Date</p>
                              <p className="font-medium">{cert.completionDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Course Hours</p>
                              <p className="font-medium">{cert.hours} hours</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Certificate Number</p>
                              <p className="font-mono text-xs">{cert.certificateNumber}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button size="sm" variant="default">
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                            <Button size="sm" variant="ghost" asChild>
                              <Link to="/verify-certificate">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Verify
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete a course to earn your first certificate
                    </p>
                    <Button asChild>
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - In Progress */}
          <div className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-base">Almost There!</CardTitle>
                <CardDescription>
                  Complete these courses to earn more certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inProgressCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-lg bg-secondary/50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight">
                        {course.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {course.progress}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Est. completion: {course.estimatedCompletion}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certificate Info */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-base">About Certificates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    All certificates are digitally signed and verifiable
                  </p>
                </div>
                <div className="flex gap-3">
                  <Share2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    Share your certificates on LinkedIn, Twitter, and other platforms
                  </p>
                </div>
                <div className="flex gap-3">
                  <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    Download high-quality PDFs of your certificates
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyCertificates;