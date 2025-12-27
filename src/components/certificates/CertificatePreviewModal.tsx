import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Certificate } from './Certificate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface CertificateData {
    id: string;
    recipientName: string;
    courseName: string;
    completionDate: string;
    issueDate: string;
    certificateNumber: string;
    instructor?: string;
    organization?: string;
}

interface CertificatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    certificate: CertificateData;
}

export function CertificatePreviewModal({
    isOpen,
    onClose,
    certificate
}: CertificatePreviewModalProps) {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            // Get the certificate element
            const certificateElement = document.getElementById('certificate-preview');
            if (!certificateElement) {
                throw new Error('Certificate element not found');
            }

            // Capture the certificate as canvas with high quality
            const canvas = await html2canvas(certificateElement, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Convert canvas to image
            const imgData = canvas.toDataURL('image/png');

            // Create PDF (A4 landscape: 297mm x 210mm)
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit certificate on page
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Certificate aspect ratio (1024px / 750px ≈ 1.37)
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;

            // Calculate dimensions to fit on page with margins
            let width = pdfWidth - 20; // 10mm margin on each side
            let height = width / ratio;

            // If height is too large, scale based on height instead
            if (height > pdfHeight - 20) {
                height = pdfHeight - 20;
                width = height * ratio;
            }

            // Center the certificate on the page
            const x = (pdfWidth - width) / 2;
            const y = (pdfHeight - height) / 2;

            // Add image to PDF
            pdf.addImage(imgData, 'PNG', x, y, width, height);

            // Download the PDF
            pdf.save(`${certificate.certificateNumber}.pdf`);

            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to download certificate. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1100px] max-h-[95vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Certificate Preview</DialogTitle>
                </DialogHeader>

                {/* Certificate Preview */}
                <div className="flex flex-col items-center gap-6 py-4">
                    <div id="certificate-preview">
                        <Certificate
                            recipientName={certificate.recipientName}
                            courseName={certificate.courseName}
                            completionDate={certificate.completionDate}
                            issueDate={certificate.issueDate}
                            certificateNumber={certificate.certificateNumber}
                            instructor={certificate.instructor}
                            organization={certificate.organization}
                        />
                    </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="flex gap-3">
                        <Button
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            size="lg"
                            className="gap-2"
                        >
                            {downloading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download PDF
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            size="lg"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
