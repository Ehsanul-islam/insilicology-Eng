import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, User, Lock, Bell, Globe, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import SEOHead from '@/components/SEOHead';
import { toast } from 'sonner';

const ProfileSettings = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || '',
    phone: user?.user_metadata?.phone || '',
    location: user?.user_metadata?.location || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id === 'fullName' ? 'fullName' : id]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('File must be a valid image (JPEG, PNG, GIF, WEBP)');
      return;
    }

    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({
        avatar_url: publicUrl
      });

      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
      // Force reload to update context if needed or just rely on local state
      setIsLoading(false);
    } catch (error) {
      toast.error('Error uploading image');
      console.error(error);
      setIsLoading(false);
    }
  };

  // Notifications Form State
  const [notifications, setNotifications] = useState({
    courseUpdates: user?.user_metadata?.notifications?.courseUpdates ?? true,
    progressReports: user?.user_metadata?.notifications?.progressReports ?? true,
    newCourses: user?.user_metadata?.notifications?.newCourses ?? true,
    achievements: user?.user_metadata?.notifications?.achievements ?? true,
    marketing: user?.user_metadata?.notifications?.marketing ?? false,
  });

  // Preferences Form State
  const [preferences, setPreferences] = useState({
    darkMode: user?.user_metadata?.preferences?.darkMode ?? false,
    language: user?.user_metadata?.preferences?.language ?? 'English',
    timezone: user?.user_metadata?.preferences?.timezone ?? 'UTC+0 (GMT)',
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    await updateProfile({
      notifications: notifications
    });
    setIsLoading(false);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    await updateProfile({
      preferences: preferences
    });
    // Apply dark mode immediately if changed (optional, would typically need a context or reload)
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await updateProfile({
      full_name: profileData.fullName,
      bio: profileData.bio,
      phone: profileData.phone,
      location: profileData.location,
    });

    setIsLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(passwordData.newPassword);

    if (!error) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }

    setIsLoading(false);
  };

  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SEOHead
        title="Profile Settings - LearnCraft"
        description="Manage your account settings and preferences"
        url="/profile/settings"
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile, security, and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profileData.avatar_url} alt={profileData.fullName} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-500 text-white text-2xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageChange}
                        />
                        <Button variant="outline" size="sm" type="button" onClick={handleImageClick} disabled={isLoading}>
                          {isLoading ? 'Uploading...' : 'Change Photo'}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG or GIF. Max size 5MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user?.email}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={handleProfileChange}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword} // Note: This isn't actually used by Supabase update password, but is good for UI completeness if we were verifying it
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      // Supabase can't easily verify current password without re-auth, so we might skip strict verification here or re-auth user
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Protect your account with two-factor authentication
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Choose what updates you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Course Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new lessons and course content
                      </p>
                    </div>
                    <Switch
                      checked={notifications.courseUpdates}
                      onCheckedChange={() => handleNotificationChange('courseUpdates')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Progress Reports</p>
                      <p className="text-sm text-muted-foreground">
                        Weekly summary of your learning progress
                      </p>
                    </div>
                    <Switch
                      checked={notifications.progressReports}
                      onCheckedChange={() => handleNotificationChange('progressReports')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">New Courses</p>
                      <p className="text-sm text-muted-foreground">
                        Be the first to know about new courses
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newCourses}
                      onCheckedChange={() => handleNotificationChange('newCourses')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Achievements</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications about certificates and milestones
                      </p>
                    </div>
                    <Switch
                      checked={notifications.achievements}
                      onCheckedChange={() => handleNotificationChange('achievements')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-muted-foreground">
                        Receive news and promotional content
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={() => handleNotificationChange('marketing')}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleSaveNotifications} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>
                    Customize how LearnCraft looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    >
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleSavePreferences} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;