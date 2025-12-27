import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Download, Share2, ExternalLink, ArrowLeft, Calendar, Loader2, Eye, Shield } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useCertificates, Certificate } from '@/hooks/useCertificates';
import { useDashboardData } from '@/hooks/useDashboardData';
import { toast } from 'sonner';
import { useState } from 'react';
import { CertificatePreviewModal } from '@/components/certificates/CertificatePreviewModal';

// Helper function to get certificate status
const getCertificateStatus = (cert: Certificate) => {
  if (!cert.downloadEnabled) {
    return {
      icon: '🟡',
      label: 'Pending Approval',
      variant: 'secondary' as const,
      message: 'Your certificate is being reviewed by admin',
      color: 'text-amber-600'
    };
  }

  if (cert.downloadEnabled && !cert.downloadedAt) {
    return {
      icon: '🟢',
      label: 'Ready to Download',
      variant: 'default' as const,
      message: 'Your certificate is ready! Click below to download',
      color: 'text-green-600'
    };
  }

  return {
    icon: '✅',
    label: 'Downloaded',
    variant: 'outline' as const,
    message: `Downloaded ${cert.downloadCount} time(s)`,
    color: 'text-blue-600'
  };
};

const MyCertificates = () => {
  const { certificates, loading: certsLoading } = useCertificates();
  const { enrolledCourses, stats, loading: dashLoading } = useDashboardData();
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

  const loading = certsLoading || dashLoading;

  // Get in-progress courses (not 100% complete)
  const inProgressCourses = enrolledCourses.filter(c => c.progress < 100 && c.progress > 0);

  const handleShare = async (certificate: Certificate) => {
    const code = certificate.verificationCode || certificate.verificationHash;
    const verificationUrl = `${window.location.origin}/verify-certificate?code=${code}`;
    const shareText = `I earned a certificate for completing "${certificate.courseName}" at LearnCraft! Verify it here:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `LearnCraft Certificate - ${certificate.courseName}`,
          text: shareText,
          url: verificationUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(verificationUrl);
        }
      }
    } else {
      copyToClipboard(verificationUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Verification link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                    <p className="text-2xl font-bold">{stats.totalHours}</p>
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
                    {certificates.map((cert) => {
                      const status = getCertificateStatus(cert);
                      return (
                        <div
                          key={cert.id}
                          className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-white to-slate-50 p-6 hover:shadow-lg transition-shadow"
                        >
                          {/* Status Badge */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Badge variant={status.variant} className="gap-1">
                              <span>{status.icon}</span>
                              {status.label}
                            </Badge>
                          </div>

                          {/* Certificate Content */}
                          <div className="space-y-4 pr-32">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-primary/10 rounded-lg">
                                <Award className="w-8 h-8 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1">
                                  {cert.courseName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Awarded to: {cert.recipientName}
                                </p>
                                <p className={`text-xs mt-2 font-medium ${status.color}`}>
                                  {status.message}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Completion Date</p>
                                <p className="font-medium">
                                  {new Date(cert.completionDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Issue Date</p>
                                <p className="font-medium">
                                  {new Date(cert.issueDate).toLocaleDateString()}
                                </p>
                              </div>
                              {cert.verificationCode && (
                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Shield className="w-3 h-3 text-primary" />
                                    <p className="text-muted-foreground">Verify Code</p>
                                  </div>
                                  <p className="font-mono font-bold text-lg text-primary">
                                    {cert.verificationCode}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-xs text-muted-foreground">Certificate Number</p>
                              <p className="font-mono text-xs">{cert.certificateNumber}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => setPreviewCertificate(cert)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Certificate
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPreviewCertificate(cert)}
                                disabled={!cert.downloadEnabled}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleShare(cert)}
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </Button>

                              <Button size="sm" variant="ghost" asChild>
                                <Link to={`/verify-certificate?code=${cert.verificationCode || cert.verificationHash}`}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Verify
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  </div >
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
              </CardContent >
            </Card >
          </div >

          {/* Sidebar - In Progress */}
          < div className="space-y-6" >
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-base">Almost There!</CardTitle>
                <CardDescription>
                  Complete these courses to earn more certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inProgressCourses.length > 0 ? (
                  inProgressCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.slug}`}
                      className="block p-4 rounded-lg bg-secondary/50 space-y-2 hover:bg-secondary/70 transition-colors"
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
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No courses in progress
                  </p>
                )}
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
          </div >
        </div >
      </main>

      {previewCertificate && (
        <CertificatePreviewModal
          isOpen={!!previewCertificate}
          onClose={() => setPreviewCertificate(null)}
          certificate={previewCertificate}
        />
      )}
    </div>
  );
};

export default MyCertificates;
