import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, Database, User, Key } from 'lucide-react';

interface ConnectionTest {
    name: string;
    status: 'loading' | 'success' | 'error';
    message: string;
    details?: string;
}

export default function SupabaseTest() {
    const [tests, setTests] = useState<ConnectionTest[]>([
        { name: 'Configuration Check', status: 'loading', message: 'Checking...' },
        { name: 'Database Connection', status: 'loading', message: 'Testing...' },
        { name: 'Authentication Service', status: 'loading', message: 'Testing...' },
    ]);

    useEffect(() => {
        runTests();
    }, []);

    const updateTest = (index: number, update: Partial<ConnectionTest>) => {
        setTests(prev => prev.map((test, i) => i === index ? { ...test, ...update } : test));
    };

    const runTests = async () => {
        // Test 1: Configuration Check
        try {
            const url = import.meta.env.VITE_SUPABASE_URL;
            const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

            if (url && key) {
                updateTest(0, {
                    status: 'success',
                    message: 'Configuration loaded successfully',
                    details: `URL: ${url}`
                });
            } else {
                updateTest(0, {
                    status: 'error',
                    message: 'Missing environment variables',
                    details: 'Check your .env file'
                });
            }
        } catch (error) {
            updateTest(0, {
                status: 'error',
                message: 'Configuration error',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        // Test 2: Database Connection
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('count')
                .limit(1);

            if (error) {
                updateTest(1, {
                    status: 'error',
                    message: 'Database query failed',
                    details: error.message
                });
            } else {
                updateTest(1, {
                    status: 'success',
                    message: 'Database connected successfully',
                    details: `Query executed without errors`
                });
            }
        } catch (error) {
            updateTest(1, {
                status: 'error',
                message: 'Database connection error',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        // Test 3: Authentication Service
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                updateTest(2, {
                    status: 'error',
                    message: 'Auth service error',
                    details: error.message
                });
            } else {
                updateTest(2, {
                    status: 'success',
                    message: session ? 'Authenticated user session found' : 'Auth service working (no active session)',
                    details: session ? `User: ${session.user.email}` : 'Not logged in'
                });
            }
        } catch (error) {
            updateTest(2, {
                status: 'error',
                message: 'Authentication check failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    const getStatusIcon = (status: ConnectionTest['status']) => {
        switch (status) {
            case 'loading':
                return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
        }
    };

    const getStatusBadge = (status: ConnectionTest['status']) => {
        switch (status) {
            case 'loading':
                return <Badge variant="outline" className="bg-blue-50 text-blue-600">Testing</Badge>;
            case 'success':
                return <Badge variant="outline" className="bg-green-50 text-green-600">Success</Badge>;
            case 'error':
                return <Badge variant="outline" className="bg-red-50 text-red-600">Failed</Badge>;
        }
    };

    const allTestsPassed = tests.every(test => test.status === 'success');
    const anyTestFailed = tests.some(test => test.status === 'error');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Supabase Connection Test
                    </h1>
                    <p className="text-slate-600">
                        Testing connection to project: <code className="text-sm bg-slate-200 px-2 py-1 rounded">hmgxicjynuxsnijhmvth</code>
                    </p>
                </div>

                {/* Overall Status */}
                <Card className="border-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Overall Status</CardTitle>
                                <CardDescription>Connection health check results</CardDescription>
                            </div>
                            {allTestsPassed && (
                                <Badge className="bg-green-500 text-white">All Systems Operational</Badge>
                            )}
                            {anyTestFailed && (
                                <Badge className="bg-red-500 text-white">Issues Detected</Badge>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                {/* Test Results */}
                <div className="space-y-4">
                    {tests.map((test, index) => (
                        <Card key={test.name} className="border">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {getStatusIcon(test.status)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg">{test.name}</h3>
                                            {getStatusBadge(test.status)}
                                        </div>
                                        <p className="text-slate-600 mb-1">{test.message}</p>
                                        {test.details && (
                                            <p className="text-sm text-slate-500 font-mono bg-slate-50 p-2 rounded">
                                                {test.details}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Configuration Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5" />
                            Configuration Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Project ID:</span>
                                <code className="bg-slate-100 px-2 py-1 rounded">{import.meta.env.VITE_SUPABASE_PROJECT_ID}</code>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Supabase URL:</span>
                                <code className="bg-slate-100 px-2 py-1 rounded">{import.meta.env.VITE_SUPABASE_URL}</code>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Anon Key:</span>
                                <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                                    {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20)}...
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={runTests}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Run Tests Again
                    </button>
                    <a
                        href={`https://supabase.com/dashboard/project/${import.meta.env.VITE_SUPABASE_PROJECT_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Open Supabase Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
