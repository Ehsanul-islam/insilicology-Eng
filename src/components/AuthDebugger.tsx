import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthDebugger = () => {
    const [authInfo, setAuthInfo] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const { data: { user } } = await supabase.auth.getUser();

            setAuthInfo({
                isAuthenticated: !!session,
                userId: user?.id,
                email: user?.email,
                sessionExists: !!session,
            });
        };

        checkAuth();
    }, []);

    if (!authInfo) return <div>Loading auth info...</div>;

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>Authentication Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 font-mono text-sm">
                    <div>
                        <strong>Authenticated:</strong> {authInfo.isAuthenticated ? '✅ Yes' : '❌ No'}
                    </div>
                    <div>
                        <strong>User ID:</strong> {authInfo.userId || 'None'}
                    </div>
                    <div>
                        <strong>Email:</strong> {authInfo.email || 'None'}
                    </div>
                    <div>
                        <strong>Session:</strong> {authInfo.sessionExists ? '✅ Active' : '❌ None'}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
