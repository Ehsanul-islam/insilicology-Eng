import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Upload, CheckCircle, Loader2, AlertCircle,
  Building2, Smartphone, Clock, X, FileImage, Copy,
  ExternalLink, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useEnrollment, EnrollmentFormField } from '@/hooks/useEnrollment';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Course {
  id: string;
  title: string;
  price_offer?: number | null;
  price_regular?: number | null;
  payment_methods?: string[] | null;
  payment_instructions?: string | null;
  enrollment_form_fields?: EnrollmentFormField[] | null;
  payment_link?: string | null;
  payment_qr_code_url?: string | null;
}

interface EnrollmentDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  isEarlyBird?: boolean;
  couponCode?: string | null;
}

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

export const EnrollmentDialog = ({ course, open, onOpenChange, onSuccess, isEarlyBird, couponCode }: EnrollmentDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    loading,
    existingEnrollment,
    checkExistingEnrollment,
    uploadPaymentProof,
    submitEnrollment,
  } = useEnrollment(course.id);

  const [step, setStep] = useState<'form' | 'payment' | 'review'>('form');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrCodeExpanded, setQrCodeExpanded] = useState(false);

  const paymentMethods = Array.isArray(course.payment_methods)
    ? course.payment_methods as string[]
    : ['bank_transfer', 'mobile_payment'];

  const formFields = Array.isArray(course.enrollment_form_fields)
    ? course.enrollment_form_fields as EnrollmentFormField[]
    : [];

  useEffect(() => {
    if (open && user) {
      checkExistingEnrollment();
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setStep('form');
      setFormData({});
      setPaymentMethod('');
      setPaymentProof(null);
      setPaymentProofPreview('');
      setShowPaymentDetails(false);
      setInstructionsExpanded(false);
      setCopiedLink(false);
    }
  }, [open]);

  // Show payment details when payment method is selected
  useEffect(() => {
    if (paymentMethod) {
      setShowPaymentDetails(true);
    } else {
      setShowPaymentDetails(false);
    }
  }, [paymentMethod]);

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

  const handleSubmit = async () => {
    setUploading(true);

    let paymentProofUrl: string | undefined;
    if (paymentProof) {
      const url = await uploadPaymentProof(paymentProof);
      if (url) {
        paymentProofUrl = url;
      }
    }

    // Append coupon code to customFormData if present
    const finalFormData = { ...formData };
    if (couponCode) {
      finalFormData['Coupon Code'] = couponCode;
    }

    const success = await submitEnrollment({
      paymentMethod,
      paymentProofUrl,
      transactionId: transactionId.trim() || undefined,
      customFormData: finalFormData,
    });

    setUploading(false);

    if (success) {
      // Record coupon usage if applicable
      if (couponCode && user) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          await supabase.from('coupon_usages').insert({
            user_id: user.id,
            coupon_code: couponCode
          });
        } catch (err) {
          console.error("Failed to record coupon usage:", err);
        }
      }

      onSuccess?.();
      onOpenChange(false);
    }
  };

  const handleCopyLink = async () => {
    if (!course.payment_link) return;

    try {
      await navigator.clipboard.writeText(course.payment_link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = course.payment_link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const canProceedToPayment = () => {
    return formFields.every((field) => {
      if (field.required) {
        return formData[field.id]?.trim();
      }
      return true;
    });
  };

  const renderFormStep = () => (
    <div className="space-y-4">
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {formFields.length > 0 ? (
          formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                />
              ) : field.type === 'select' && field.options ? (
                <Select
                  value={formData[field.id] || ''}
                  onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || 'Select...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
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
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No additional information required. Proceed to payment.
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => setStep('payment')} disabled={!canProceedToPayment()}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-2">
      <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-2">
        <div className="p-4 rounded-lg bg-muted">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Course Price</span>
            <span className="text-2xl font-bold">
              {course.price_offer ? `$${Number(course.price_offer).toLocaleString()}` : 'Free'}
            </span>
          </div>
          {isEarlyBird && (
            <div className="px-4 pb-3">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 w-full justify-center">
                🎉 Early Bird Pricing Applied!
              </Badge>
            </div>
          )}
          {course.price_regular && course.price_offer && course.price_offer < course.price_regular && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Original Price</span>
              <span className="text-sm line-through text-muted-foreground">
                ${Number(course.price_regular).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-primary font-semibold text-lg">Select Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            {paymentMethods.map((method) => {
              const info = PAYMENT_METHOD_INFO[method] || {
                icon: <CreditCard className="w-5 h-5" />,
                label: method,
                description: '',
              };
              return (
                <div
                  key={method}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === method
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                    }`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <RadioGroupItem value={method} id={method} />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-muted">{info.icon}</div>
                    <div>
                      <Label htmlFor={method} className="cursor-pointer font-medium">
                        {info.label}
                      </Label>
                      {info.description && (
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      )}
                    </div>
                  </div>
                  {method === 'card' && (
                    <div className="flex items-center gap-2 ml-auto">
                      <img src="/visa-logo.png" alt="Visa" className="h-12 w-auto" />
                      <img src="/mastercard-logo.png" alt="Mastercard" className="h-12 w-auto" />
                    </div>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Payment Details Section - Shows after selection */}
        {showPaymentDetails && course.payment_link && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {/* Payment Link & QR Code Card */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Payment Details</h4>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Copy the payment link or scan the QR code to make payment
              </p>

              <div className="space-y-4">
                {/* Payment Link */}
                <div className="border rounded-lg p-4 bg-white space-y-3">
                  <p className="text-sm font-medium">Payment Link</p>
                  <div className="flex gap-2">
                    <Input
                      value={course.payment_link}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={() => window.open(course.payment_link, '_blank')}
                    className="w-full"
                    variant="default"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Payment Page
                  </Button>
                </div>

                {/* QR Code - Collapsible */}
                {course.payment_qr_code_url && (
                  <div className="border rounded-lg p-4 bg-white">
                    <button
                      onClick={() => setQrCodeExpanded(!qrCodeExpanded)}
                      className="w-full flex items-center justify-between text-sm font-medium hover:text-primary transition-colors"
                    >
                      <span>QR Code</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {qrCodeExpanded ? 'Hide' : 'Show'}
                        </span>
                        {qrCodeExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {qrCodeExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 space-y-2">
                            <div className="flex justify-center">
                              <img
                                src={course.payment_qr_code_url}
                                alt="Payment QR Code"
                                className="w-40 h-40 object-contain border rounded"
                              />
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                              Scan with camera or banking app
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Instructions */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setInstructionsExpanded(!instructionsExpanded)}
                className="w-full px-4 py-3 bg-primary/20 hover:bg-primary/30 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">How to make payments?</span>
                </div>
                {instructionsExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <AnimatePresence>
                {instructionsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4 bg-white">
                      <p className="text-sm font-medium text-muted-foreground">
                        Follow these steps to complete your payment:
                      </p>

                      {/* Step 1 */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Choose your payment method:</p>
                          <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                            <li>• Click "Copy" and paste link in your browser</li>
                            <li>• OR click "Open Payment Page"</li>
                            <li>• OR scan QR code with your phone camera</li>
                          </ul>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Complete the payment:</p>
                          <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                            <li>• You'll be redirected to secure payment gateway</li>
                            <li>• Enter your card details (Visa/Mastercard)</li>
                            <li>• Verify and confirm payment</li>
                          </ul>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Save payment confirmation:</p>
                          <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                            <li>• Take a screenshot of the success page</li>
                            <li>• Make sure it clearly shows:</li>
                            <li className="ml-4">- Transaction ID</li>
                            <li className="ml-4">- Amount paid</li>
                            <li className="ml-4">- Date and time</li>
                          </ul>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                          4
                        </div>
                        <div>
                          <p className="font-medium">Upload screenshot below</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Use the upload box below to submit your payment proof
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Upload Payment Proof Section */}
        <div className="space-y-2">
          <Label>Upload Payment Proof</Label>
          <p className="text-sm text-muted-foreground">
            Please upload a screenshot of your payment confirmation
          </p>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${paymentProofPreview ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {paymentProofPreview ? (
              <div className="relative">
                <img
                  src={paymentProofPreview}
                  alt="Payment proof"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaymentProof(null);
                    setPaymentProofPreview('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <FileImage className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Click to upload payment screenshot</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
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

        {/* Transaction ID Section */}
        <div className="space-y-2">
          <Label htmlFor="transaction_id">Transaction ID (Optional)</Label>
          <p className="text-sm text-muted-foreground">
            Enter the transaction ID from your payment confirmation
          </p>
          <Input
            id="transaction_id"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g., TXN123456789 or pay_AbCd123XyZ"
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={() => setStep('form')}>
          Back
        </Button>
        <Button onClick={() => setStep('review')} disabled={!paymentMethod || !paymentProof}>
          Review Submission
        </Button>
      </div>
    </div>
  );



  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-muted space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Course</span>
              <span className="font-medium">{course.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {course.price_offer ? `$${Number(course.price_offer).toLocaleString()}` : 'Free'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">
                {PAYMENT_METHOD_INFO[paymentMethod]?.label || paymentMethod}
              </span>
            </div>
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium font-mono text-xs">{transactionId}</span>
              </div>
            )}
          </div>

          {Object.keys(formData).length > 0 && (
            <div className="p-4 rounded-lg border space-y-2">
              <p className="font-medium text-sm">Additional Information</p>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}

          {paymentProofPreview && (
            <div className="p-4 rounded-lg border">
              <p className="font-medium text-sm mb-2">Payment Proof</p>
              <img
                src={paymentProofPreview}
                alt="Payment proof"
                className="max-h-32 rounded-lg"
              />
            </div>
          )}
        </div>

        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your enrollment will be reviewed within 24-48 hours. You'll receive a notification once approved.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('payment')} disabled={loading || uploading}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading || uploading}>
          {loading || uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Enrollment'
          )}
        </Button>
      </div>
    </div>
  );

  const renderExistingEnrollment = () => {
    if (!existingEnrollment) return null;

    const statusConfig: Record<string, { color: string; message: string }> = {
      pending: {
        color: 'bg-yellow-500',
        message: 'Your enrollment is pending review. We will notify you once it\'s approved.',
      },
      active: {
        color: 'bg-green-500',
        message: 'You are already enrolled in this course.',
      },
      completed: {
        color: 'bg-blue-500',
        message: 'You have completed this course.',
      },
      cancelled: {
        color: 'bg-red-500',
        message: existingEnrollment.rejection_reason
          ? `Enrollment was not approved: ${existingEnrollment.rejection_reason}`
          : 'Your enrollment was cancelled.',
      },
    };

    const config = statusConfig[existingEnrollment.status] || statusConfig.pending;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.color}`} />
          <Badge variant="outline" className="capitalize">
            {existingEnrollment.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">{config.message}</p>
        {existingEnrollment.status === 'active' && (
          <Button asChild className="w-full">
            <a href={`/learn/${course.title}`}>Continue Learning</a>
          </Button>
        )}
        {existingEnrollment.status === 'cancelled' && (
          <Button
            onClick={() => {
              setStep('form');
              // Reset existing enrollment to allow re-enrollment
            }}
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to enroll in this course.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate('/auth', { state: { returnTo: window.location.pathname } })}>
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {existingEnrollment && existingEnrollment.status !== 'cancelled'
              ? 'Enrollment Status'
              : 'Enroll in Course'}
          </DialogTitle>
          <DialogDescription>
            {existingEnrollment && existingEnrollment.status !== 'cancelled'
              ? course.title
              : `Complete your enrollment for "${course.title}"`}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        {!existingEnrollment || existingEnrollment.status === 'cancelled' ? (
          <>
            <div className="flex items-center justify-center gap-2 py-2">
              {['form', 'payment', 'review'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['form', 'payment', 'review'].indexOf(step) > i
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {['form', 'payment', 'review'].indexOf(step) > i ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {
                    i < 2 && (
                      <div
                        className={`w-8 h-0.5 ${['form', 'payment', 'review'].indexOf(step) > i
                          ? 'bg-primary'
                          : 'bg-muted'
                          }`}
                      />
                    )
                  }
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 'form' && renderFormStep()}
                {step === 'payment' && renderPaymentStep()}
                {step === 'review' && renderReviewStep()}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          renderExistingEnrollment()
        )}
      </DialogContent>
    </Dialog >
  );
};
