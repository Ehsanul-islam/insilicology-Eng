import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Upload, CheckCircle, Loader2, AlertCircle,
  Building2, Smartphone, Clock, X, FileImage, Copy,
  ExternalLink, HelpCircle, ChevronDown, ChevronUp,
  ArrowLeft, Shield, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseDetail } from '@/hooks/useCourses';
import { useEnrollment, EnrollmentFormField } from '@/hooks/useEnrollment';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const PAYMENT_METHOD_INFO: Record<string, { icon: React.ReactNode; label: string; description: string }> = {
  bank_transfer: {
    icon: <Building2 className="w-5 h-5" />,
    label: 'Bank Transfer',
    description: 'Transfer to our bank account',
  },
  mobile_payment: {
    icon: <Smartphone className="w-5 h-5" />,
    label: 'Mobile Payment',
    description: 'bKash, Nagad, Rocket',
  },
  card: {
    icon: <CreditCard className="w-5 h-5" />,
    label: 'Card Payment',
    description: 'Visa/Master Card',
  },
};

const PaymentPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, loading: courseLoading, error: courseError, isEnrolled, refetch } = useCourseDetail(slug);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const courseId = course?.id || '';
  const {
    loading,
    existingEnrollment,
    checkExistingEnrollment,
    uploadPaymentProof,
    submitEnrollment,
  } = useEnrollment(courseId);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrCodeExpanded, setQrCodeExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !courseLoading) {
      navigate('/auth', { state: { returnTo: `/payment/${slug}` } });
    }
  }, [user, courseLoading, navigate, slug]);

  // Check enrollment on load
  useEffect(() => {
    if (user && courseId) {
      checkExistingEnrollment();
    }
  }, [user, courseId]);

  // Redirect if already enrolled
  useEffect(() => {
    if (isEnrolled && course?.slug) {
      navigate(`/learn/${course.slug}`);
    }
  }, [isEnrolled, course?.slug, navigate]);

  // Cast course to access payment fields that exist in DB but not in generated TS types
  const courseData = course as typeof course & {
    payment_link?: string | null;
    payment_qr_code_url?: string | null;
    payment_methods?: string[] | null;
    enrollment_form_fields?: unknown[] | null;
    payment_instructions?: string | null;
  };

  const paymentMethods = Array.isArray(courseData?.payment_methods)
    ? courseData.payment_methods as string[]
    : ['bank_transfer', 'mobile_payment'];

  const formFields = Array.isArray(courseData?.enrollment_form_fields)
    ? courseData.enrollment_form_fields as unknown as EnrollmentFormField[]
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setPaymentProof(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleCopyLink = async () => {
    if (!courseData?.payment_link) return;
    try {
      await navigator.clipboard.writeText(courseData.payment_link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = courseData.payment_link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);

    let paymentProofUrl: string | undefined;
    if (paymentProof) {
      const url = await uploadPaymentProof(paymentProof);
      if (url) paymentProofUrl = url;
    }

    const success = await submitEnrollment({
      paymentMethod,
      paymentProofUrl,
      transactionId: transactionId.trim() || undefined,
      customFormData: formData,
    });

    setUploading(false);

    if (success) {
      setSubmitted(true);
      refetch();
    }
  };

  const canSubmit = paymentMethod && paymentProof;

  // Loading State
  if (courseLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-5 gap-6">
            <Skeleton className="lg:col-span-3 h-[70vh] rounded-2xl" />
            <Skeleton className="lg:col-span-2 h-[70vh] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-500 mb-6">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Success State
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Submitted!</h1>
          <p className="text-gray-500 mb-6">
            We will review your payment and confirm your enrollment within 24-48 hours.
            You'll receive a notification once approved.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(`/courses/${slug}`)}>
              Back to Course
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Existing Pending Enrollment
  if (existingEnrollment && existingEnrollment.status !== 'cancelled') {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {existingEnrollment.status === 'pending' ? 'Enrollment Pending' : 'Already Enrolled'}
          </h1>
          <p className="text-gray-500 mb-6">
            {existingEnrollment.status === 'pending'
              ? 'Your enrollment is pending review. We will notify you once it\'s approved.'
              : 'You are already enrolled in this course.'}
          </p>
          <Button onClick={() => navigate(`/courses/${slug}`)}>
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const effectivePrice = course.price_offer ? Number(course.price_offer) : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(`/courses/${slug}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Course</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-sm lg:text-base font-semibold text-gray-900 truncate">
            Complete your enrollment
          </h1>
        </div>
      </div>

      {/* Main Content — fills remaining viewport, no scroll on desktop */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-4 lg:p-6 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">

            {/* ═══════════════════════════════════════════════════════
                LEFT CARD — Payment Form (≈60%)
            ═══════════════════════════════════════════════════════ */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:max-h-[calc(100vh-100px)]">
              {/* Price Header */}
              <div className="px-5 lg:px-7 pt-5 lg:pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Course Fee</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                        ${effectivePrice ? Number(effectivePrice).toLocaleString() : 'Free'}
                      </span>
                      {course.price_regular && effectivePrice < Number(course.price_regular) && (
                        <span className="text-base text-gray-400 line-through">
                          ${Number(course.price_regular).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Secure</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 truncate">{course.title}</p>
              </div>

              {/* Scrollable content area (only scrolls on mobile, fits on desktop) */}
              <div className="flex-1 overflow-y-auto px-5 lg:px-7 py-4 space-y-5">

                {/* Custom Form Fields (if any) */}
                {formFields.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-800">Your Information</h3>
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-1">
                        <Label htmlFor={field.id} className="text-xs text-gray-600">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-0.5">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.id}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                            className="bg-gray-50 border-gray-200 text-sm h-16 resize-none"
                          />
                        ) : field.type === 'select' && field.options ? (
                          <Select
                            value={formData[field.id] || ''}
                            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
                          >
                            <SelectTrigger className="bg-gray-50 border-gray-200 text-sm h-9">
                              <SelectValue placeholder={field.placeholder || 'Select...'} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                            className="bg-gray-50 border-gray-200 text-sm h-9"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-semibold text-gray-800">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    {paymentMethods.map((method) => {
                      const info = PAYMENT_METHOD_INFO[method] || {
                        icon: <CreditCard className="w-5 h-5" />,
                        label: method,
                        description: '',
                      };
                      return (
                        <div
                          key={method}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === method
                              ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          onClick={() => setPaymentMethod(method)}
                        >
                          <RadioGroupItem value={method} id={method} className="shrink-0" />
                          <div className="p-1.5 rounded-lg bg-gray-100">
                            {info.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Label htmlFor={method} className="cursor-pointer text-sm font-medium text-gray-800">
                              {info.label}
                            </Label>
                            {info.description && (
                              <p className="text-xs text-gray-500">{info.description}</p>
                            )}
                          </div>
                          {method === 'card' && (
                            <div className="flex items-center gap-1 ml-auto shrink-0">
                              <img src="/visa-logo.png" alt="Visa" className="h-6 w-auto" />
                              <img src="/mastercard-logo.png" alt="Mastercard" className="h-6 w-auto" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Payment Link & QR Code */}
                {paymentMethod && courseData.payment_link && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-semibold text-gray-800">Payment Link</h4>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={courseData.payment_link}
                          readOnly
                          className="text-xs bg-white border-blue-100 flex-1"
                        />
                        <Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0 text-xs">
                          {copiedLink ? (
                            <><CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" /> Copied</>
                          ) : (
                            <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>
                          )}
                        </Button>
                      </div>
                      <Button
                        onClick={() => window.open(courseData.payment_link!, '_blank')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
                        size="sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Open Payment Page
                      </Button>

                      {/* QR Code */}
                      {courseData.payment_qr_code_url && (
                        <div className="pt-2 border-t border-blue-100">
                          <button
                            onClick={() => setQrCodeExpanded(!qrCodeExpanded)}
                            className="w-full flex items-center justify-between text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <span>Scan QR Code</span>
                            {qrCodeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          <AnimatePresence>
                            {qrCodeExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 flex flex-col items-center gap-1.5">
                                  <img
                                    src={courseData.payment_qr_code_url}
                                    alt="Payment QR Code"
                                    className="w-28 h-28 object-contain border rounded-lg"
                                  />
                                  <p className="text-[11px] text-gray-400">Scan with camera or banking app</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Upload Payment Proof */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">Upload Payment Proof</h3>
                  <div
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      paymentProofPreview
                        ? 'border-blue-400 bg-blue-50/30'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {paymentProofPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={paymentProofPreview}
                          alt="Payment proof"
                          className="max-h-24 rounded-lg mx-auto"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 w-6 h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentProof(null);
                            setPaymentProofPreview('');
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <FileImage className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="text-sm font-medium text-gray-600">Click to upload screenshot</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="space-y-1.5">
                  <Label htmlFor="transaction_id" className="text-sm font-semibold text-gray-800">
                    Transaction ID <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="transaction_id"
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g., TXN123456789"
                    className="font-mono text-sm bg-gray-50 border-gray-200 h-9"
                  />
                </div>
              </div>

              {/* Submit Button (sticky at bottom) */}
              <div className="px-5 lg:px-7 py-4 border-t border-gray-100 flex-shrink-0">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading || uploading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-5 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading || uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    `Submit Enrollment — $${effectivePrice ? Number(effectivePrice).toLocaleString() : 'Free'}`
                  )}
                </Button>
                <p className="text-center text-[11px] text-gray-400 mt-2">
                  Your enrollment will be reviewed within 24-48 hours
                </p>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                RIGHT CARD — Payment Instructions (≈40%)
            ═══════════════════════════════════════════════════════ */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:max-h-[calc(100vh-100px)]">
              {/* Header */}
              <div className="px-5 lg:px-6 pt-5 lg:pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">How to Pay</h2>
                </div>
              </div>

              {/* Steps */}
              <div className="flex-1 overflow-y-auto px-5 lg:px-6 py-4 space-y-4">

                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Choose payment method</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      Select Bank Transfer, Mobile Payment, or Card from the options on the left.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Complete your payment</p>
                    <ul className="text-xs text-gray-500 mt-1 space-y-0.5 leading-relaxed">
                      <li>• Click <strong>"Open Payment Page"</strong> or copy the link</li>
                      <li>• Or scan the QR code with your phone</li>
                      <li>• Enter your details and confirm payment</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Save payment confirmation</p>
                    <ul className="text-xs text-gray-500 mt-1 space-y-0.5 leading-relaxed">
                      <li>• Take a screenshot of the success page</li>
                      <li>• Make sure it shows <strong>Transaction ID</strong>, <strong>Amount</strong>, and <strong>Date</strong></li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Upload & submit</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      Upload your payment screenshot and click <strong>"Submit Enrollment"</strong> to complete the process.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-3">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div className="text-xs text-amber-800 leading-relaxed">
                        <p className="font-semibold mb-0.5">Important</p>
                        <p>Your enrollment will be reviewed within <strong>24-48 hours</strong>. You will receive a notification once it's approved.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    <span>100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Lifetime Access After Enrollment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                    <span>Certificate Upon Completion</span>
                  </div>
                </div>

                {/* Need Help */}
                <div className="pt-2">
                  <p className="text-xs text-gray-400">
                    Need help? <Link to="/contact" className="text-blue-600 hover:underline font-medium">Contact Support</Link>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
