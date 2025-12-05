import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, CheckCircle2, XCircle, Award, Calendar, User, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVerifyCertificate } from '@/hooks/useCertificates';

const CertificateVerify = () => {
  const [searchParams] = useSearchParams();
  const [certificateNumber, setCertificateNumber] = useState('');
  const { loading: isVerifying, result, verifyCertificate, reset } = useVerifyCertificate();

  // Auto-verify if code is in URL (from QR code scan)
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !result) {
      setCertificateNumber(code);
      verifyCertificate(code);
    }
  }, [searchParams]);

  const handleVerify = async () => {
    if (!certificateNumber.trim()) return;
    await verifyCertificate(certificateNumber.trim());
  };

  const handleReset = () => {
    setCertificateNumber('');
    reset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && certificateNumber.trim()) {
      handleVerify();
    }
  };

  const verificationUrl = result?.certificate
    ? `${window.location.origin}/verify-certificate?code=${result.certificate.verificationHash}`
    : '';

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Verify Certificate - Check Authenticity | LearnCraft"
        description="Verify the authenticity of LearnCraft certificates. Enter the certificate number to confirm legitimacy and view certificate details."
        url="/verify-certificate"
        type="website"
        tags={['certificate verification', 'verify certificate', 'certificate authenticity']}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Shield className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Verify Certificate
              </h1>
              <p className="text-xl text-white/90">
                Check the authenticity of LearnCraft certificates instantly
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-16">
          <div className="max-w-2xl mx-auto">
            {/* Verification Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Enter Certificate Number</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="e.g., CERT-2024-ABC123 or verification code"
                        value={certificateNumber}
                        onChange={(e) => setCertificateNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 h-12 text-lg"
                        disabled={isVerifying}
                      />
                    </div>
                    <Button
                      onClick={handleVerify}
                      disabled={!certificateNumber.trim() || isVerifying}
                      className="w-full btn-primary h-12 text-lg"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Certificate'}
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> The certificate number can be found at the top of the certificate document.
                      It follows the format: CERT-YYYY-XXXXXX. You can also use the verification code.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Verification Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <Card className={
                  result.valid
                    ? 'border-green-500 border-2'
                    : 'border-destructive border-2'
                }>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={
                        result.valid
                          ? 'w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0'
                          : 'w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0'
                      }>
                        {result.valid ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={
                          result.valid
                            ? 'text-2xl font-bold text-green-600 mb-2'
                            : 'text-2xl font-bold text-destructive mb-2'
                        }>
                          {result.valid ? 'Certificate Valid' : 'Certificate Not Found'}
                        </h3>
                        <p className="text-muted-foreground">
                          {result.valid
                            ? 'This certificate has been verified as authentic and was issued by LearnCraft.'
                            : 'No certificate found with this number. Please check the number and try again.'}
                        </p>
                      </div>
                    </div>

                    {result.valid && result.certificate && (
                      <div className="space-y-4 pt-6 border-t border-border">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-primary shrink-0 mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Recipient</p>
                              <p className="font-semibold">{result.certificate.recipientName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-primary shrink-0 mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Course</p>
                              <p className="font-semibold">{result.certificate.courseName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Issue Date</p>
                              <p className="font-semibold">
                                {new Date(result.certificate.issueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Completion Date</p>
                              <p className="font-semibold">
                                {new Date(result.certificate.completionDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-4">
                          <Badge className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                          <Badge variant="outline">
                            Certificate #{result.certificate.certificateNumber}
                          </Badge>
                        </div>

                        {/* QR Code Section */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="flex items-center gap-2 mb-4">
                            <QrCode className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Verification QR Code</h4>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="p-4 bg-white rounded-lg shadow-sm">
                              <QRCodeSVG
                                value={verificationUrl}
                                size={120}
                                level="H"
                                includeMargin
                              />
                            </div>
                            <div className="text-sm text-muted-foreground text-center sm:text-left">
                              <p>Scan this QR code to verify this certificate anytime.</p>
                              <p className="mt-1 font-mono text-xs break-all">
                                {result.certificate.verificationHash}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full mt-6"
                    >
                      Verify Another Certificate
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">How Verification Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Enter Certificate Number',
                    description: 'Input the unique certificate number or scan the QR code on the certificate.',
                  },
                  {
                    step: '2',
                    title: 'Instant Verification',
                    description: 'Our system checks the certificate against our secure database.',
                  },
                  {
                    step: '3',
                    title: 'View Details',
                    description: 'Get instant confirmation with complete certificate information.',
                  },
                ].map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">{item.step}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CertificateVerify;
