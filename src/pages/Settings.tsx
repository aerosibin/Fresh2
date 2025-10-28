import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Settings = () => {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how FreshAI looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-mode" className="flex flex-col gap-1">
                <span>Theme</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Choose your preferred color theme
                </span>
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                <span>Email Notifications</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Receive updates about your orders
                </span>
              </Label>
              <Switch id="email-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="order-updates" className="flex flex-col gap-1">
                <span>Order Updates</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Get notified about order status changes
                </span>
              </Label>
              <Switch id="order-updates" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="promotional" className="flex flex-col gap-1">
                <span>Promotional Emails</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Receive special offers and deals
                </span>
              </Label>
              <Switch id="promotional" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="personalized" className="flex flex-col gap-1">
                <span>Personalized Recommendations</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Use your browsing history for better product suggestions
                </span>
              </Label>
              <Switch id="personalized" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="flex flex-col gap-1">
                <span>Analytics</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Help us improve by sharing usage data
                </span>
              </Label>
              <Switch id="analytics" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
