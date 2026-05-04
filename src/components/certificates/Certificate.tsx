import { Award, BadgeCheck } from 'lucide-react';

interface CertificateProps {
    recipientName: string;
    courseName: string;
    completionDate: string;
    issueDate: string;
    certificateNumber: string;
    instructor?: string;
    organization?: string;
}

export function Certificate({
    recipientName,
    courseName,
    completionDate,
    issueDate,
    certificateNumber,
    instructor = "Dr. James Rodriguez",
    organization = "insilicology"
}: CertificateProps) {
    // Format dates to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Extract year from issue date for badge
    const year = new Date(issueDate).getFullYear();

    return (
        <div className="relative w-[1024px]">
            {/* Certificate Frame */}
            <div className="relative bg-white shadow-2xl">
                {/* Decorative Border */}
                <div className="absolute inset-0 border-[16px] border-double border-amber-600 pointer-events-none"></div>
                <div className="absolute inset-[20px] border-2 border-amber-500/30 pointer-events-none"></div>

                {/* Corner Decorations */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-amber-600"></div>
                <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-amber-600"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-amber-600"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-amber-600"></div>

                {/* Right Ribbon with Badge */}
                <div className="absolute right-12 top-20 z-10">
                    <div className="relative">
                        {/* Ribbon */}
                        <div className="bg-gradient-to-b from-amber-500 to-amber-600 w-24 pb-8 shadow-lg">
                            <div className="pt-6 pb-4 flex flex-col items-center gap-2">
                                <div className="bg-white rounded-full p-3 shadow-md">
                                    <BadgeCheck className="w-8 h-8 text-amber-600" fill="currentColor" />
                                </div>
                                <div className="text-white text-center px-2">
                                    <div className="text-xs">Excellence</div>
                                    <div className="text-xl">{year}</div>
                                </div>
                            </div>
                            {/* Ribbon tail */}
                            <div className="absolute bottom-0 left-0 w-full h-8 flex">
                                <div className="w-1/2 bg-amber-600 clip-ribbon-left"></div>
                                <div className="w-1/2 bg-amber-600 clip-ribbon-right"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative px-20 py-16">
                    {/* Title Section */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Award className="w-12 h-12 text-amber-600" />
                        </div>
                        <h1 className="text-amber-700 mb-2 tracking-wide text-5xl">Certificate of Completion</h1>
                    </div>

                    {/* Recipient Section */}
                    <div className="text-center mb-8">
                        <p className="text-slate-600 mb-3">This is to certify that</p>
                        <div className="relative inline-block">
                            <h2 className="text-3xl text-slate-800 px-8">{recipientName}</h2>
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="text-center mb-12">
                        <p className="text-slate-600 mb-2">has successfully completed the course</p>
                        <h3 className="text-2xl text-slate-800 mb-2">{courseName}</h3>
                    </div>

                    {/* Dates and Signatures */}
                    <div className="grid grid-cols-2 gap-8 mb-6 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="mb-6">
                                <p className="text-slate-600 text-sm mb-1">Date of Completion</p>
                                <p className="text-slate-800">{formatDate(completionDate)}</p>
                            </div>
                            <div className="border-t border-slate-300 pt-2">
                                <p className="text-slate-600 text-sm">Instructor</p>
                                <p className="text-slate-800">{instructor}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="mb-6">
                                <p className="text-slate-600 text-sm mb-1">Date of Issue</p>
                                <p className="text-slate-800">{formatDate(issueDate)}</p>
                            </div>
                            <div className="border-t border-slate-300 pt-2">
                                <p className="text-slate-600 text-sm">Organization</p>
                                <p className="text-slate-800">{organization}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Certificate ID */}
                    <div className="pt-4 border-t border-slate-200">
                        {/* Certificate ID */}
                        <div className="text-center">
                            <p className="text-slate-600 text-sm mb-1">Certificate ID</p>
                            <p className="text-slate-800 font-mono font-bold">{certificateNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
