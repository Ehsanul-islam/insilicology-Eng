import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  recipientName: string;
  completionDate: string;
  issueDate: string;
  certificateNumber: string;
  verificationHash: string;
  isActive: boolean;
  certificateData: Record<string, any> | null;
}

export interface VerificationResult {
  valid: boolean;
  certificate: Certificate | null;
}

export const useCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserCertificates();
    }
  }, [user]);

  const fetchUserCertificates = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('issue_date', { ascending: false });

      if (error) throw error;

      const processed: Certificate[] = data?.map(cert => ({
        id: cert.id,
        userId: cert.user_id || '',
        courseId: cert.course_id || '',
        courseName: cert.course_name,
        recipientName: cert.recipient_name,
        completionDate: cert.completion_date,
        issueDate: cert.issue_date || cert.completion_date,
        certificateNumber: cert.certificate_number,
        verificationHash: cert.verification_hash,
        isActive: cert.is_active || true,
        certificateData: cert.certificate_data as Record<string, any> | null,
      })) || [];

      setCertificates(processed);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  return {
    certificates,
    loading,
    refetch: fetchUserCertificates,
  };
};

export const useVerifyCertificate = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifyCertificate = async (certificateNumber: string): Promise<VerificationResult> => {
    setLoading(true);
    setResult(null);

    try {
      // Search by certificate number or verification hash
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .or(`certificate_number.ilike.${certificateNumber},verification_hash.eq.${certificateNumber}`)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const certificate: Certificate = {
          id: data.id,
          userId: data.user_id || '',
          courseId: data.course_id || '',
          courseName: data.course_name,
          recipientName: data.recipient_name,
          completionDate: data.completion_date,
          issueDate: data.issue_date || data.completion_date,
          certificateNumber: data.certificate_number,
          verificationHash: data.verification_hash,
          isActive: data.is_active || true,
          certificateData: data.certificate_data as Record<string, any> | null,
        };

        const verificationResult = { valid: true, certificate };
        setResult(verificationResult);
        return verificationResult;
      }

      const verificationResult = { valid: false, certificate: null };
      setResult(verificationResult);
      return verificationResult;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      const verificationResult = { valid: false, certificate: null };
      setResult(verificationResult);
      return verificationResult;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    loading,
    result,
    verifyCertificate,
    reset,
  };
};

// Generate certificate number: CERT-YYYY-XXXXXX
export const generateCertificateNumber = (): string => {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-${year}-${randomPart}`;
};

// Generate verification hash
export const generateVerificationHash = (): string => {
  return Array.from({ length: 32 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('').toUpperCase();
};
