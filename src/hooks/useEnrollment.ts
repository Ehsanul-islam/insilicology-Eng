import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EnrollmentFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface EnrollmentData {
  paymentMethod: string;
  paymentProofUrl?: string;
  transactionId?: string;
  customFormData: Record<string, string>;
  /** Set when the student submits payment while Early Bird slots/pricing still apply. */
  earlyBirdEnrollment?: boolean;
}

export const useEnrollment = (courseId: string) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingEnrollment, setExistingEnrollment] = useState<{
    id: string;
    status: string;
    payment_status: string;
    rejection_reason?: string;
  } | null>(null);

  const checkExistingEnrollment = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('enrollments')
      .select('id, status, payment_status, rejection_reason')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) {
      console.error('Error checking enrollment:', error);
      return null;
    }

    setExistingEnrollment(data);
    return data;
  };

  const uploadPaymentProof = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${courseId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-screenshots')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload payment proof');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const submitEnrollment = async (data: EnrollmentData): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to enroll');
      return false;
    }

    setLoading(true);

    try {
      // Check if already enrolled
      const existing = await checkExistingEnrollment();
      if (existing && existing.status !== 'cancelled') {
        if (existing.status === 'pending') {
          toast.info('Your enrollment is already pending review');
        } else if (existing.status === 'active') {
          toast.info('You are already enrolled in this course');
        }
        setLoading(false);
        return false;
      }

      // If there's a cancelled enrollment, update it instead of creating new
      if (existing && existing.status === 'cancelled') {
        const { error } = await supabase
          .from('enrollments')
          .update({
            status: 'pending',
            payment_status: 'pending',
            payment_method: data.paymentMethod,
            payment_proof_url: data.paymentProofUrl,
            transaction_id: data.transactionId,
            custom_form_data: data.customFormData,
            rejection_reason: null,
            early_bird_enrollment: data.earlyBirdEnrollment ?? false,
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Enrollment update error:', error);
          const errorMessage = error?.message || 'Failed to submit enrollment';
          toast.error(`Failed to submit enrollment: ${errorMessage}`);
          return false;
        }

        // Send enrollment submitted email
        try {
          await supabase.functions.invoke('send-enrollment-notification', {
            body: {
              enrollmentId: existing.id,
              type: 'submitted'
            }
          });
        } catch (emailError) {
          console.error('Failed to send enrollment email:', emailError);
          // Don't fail the enrollment if email fails
        }

        toast.success('Enrollment submitted! We will review and confirm shortly.');
        await checkExistingEnrollment();
        return true;
      }

      // Ensure profile exists before proceeding
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        console.log('Profile missing, creating one...');
        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
        });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Continue anyway and let the foreign key constraint fail if it must, 
          // but usually this insert should fix it.
        }
      }

      // Create new enrollment
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'pending',
          payment_status: 'pending',
          payment_method: data.paymentMethod,
          payment_proof_url: data.paymentProofUrl,
          transaction_id: data.transactionId,
          custom_form_data: data.customFormData,
          early_bird_enrollment: data.earlyBirdEnrollment ?? false,
        })
        .select()
        .single();

      if (error) {
        console.error('Enrollment error:', error);

        // Handle duplicate key error specifically
        if (error.message.includes('duplicate key') || error.code === '23505') {
          toast.error('You are already enrolled in this course');
        } else {
          const errorMessage = error?.message || 'Failed to submit enrollment';
          toast.error(`Failed to submit enrollment: ${errorMessage}`);
        }
        return false;
      }

      // Send enrollment submitted email
      try {
        await supabase.functions.invoke('send-enrollment-notification', {
          body: {
            enrollmentId: enrollment.id,
            type: 'submitted'
          }
        });
      } catch (emailError) {
        console.error('Failed to send enrollment email:', emailError);
        // Don't fail the enrollment if email fails
      }

      toast.success('Enrollment submitted! We will review and confirm shortly.');
      await checkExistingEnrollment();
      return true;
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('An error occurred during enrollment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelEnrollment = async (): Promise<boolean> => {
    if (!user || !existingEnrollment) return false;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: 'cancelled' })
        .eq('id', existingEnrollment.id)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to cancel enrollment');
        return false;
      }

      toast.success('Enrollment cancelled');
      await checkExistingEnrollment();
      return true;
    } catch (error) {
      console.error('Cancel error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    existingEnrollment,
    checkExistingEnrollment,
    uploadPaymentProof,
    submitEnrollment,
    cancelEnrollment,
  };
};
