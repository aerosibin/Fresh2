import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

const authSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [riderPassword, setRiderPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, userRole, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = authSchema.parse({ email, password });
      setIsLoading(true);

      // Convert 'admin' to valid email format
      const emailToUse = validated.email === 'admin' 
        ? 'admin@local.com' 
        : validated.email.includes('@') 
          ? validated.email 
          : `${validated.email}@local.com`;

      const { error } = await supabase.auth.signUp({
        email: emailToUse,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: 'Account created!',
        description: 'You can now sign in with your credentials.',
      });
      
      navigate('/');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else if (error.message?.includes('already registered')) {
        toast({
          title: 'Account exists',
          description: 'This email is already registered. Please sign in instead.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create account',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = authSchema.parse({ email, password });
      setIsLoading(true);

      // Convert 'admin' to valid email format
      const emailToUse = validated.email === 'admin' 
        ? 'admin@local.com' 
        : validated.email.includes('@') 
          ? validated.email 
          : `${validated.email}@local.com`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: validated.password,
      });

      if (error) throw error;

      // Check user role and redirect accordingly
      if (data.user) {
        // @ts-ignore - Types will regenerate after migration
        const { data: roleData } = await supabase
          // @ts-ignore
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (roleData && (roleData as any).role === 'admin') {
          navigate('/admin');
        } else if (roleData && (roleData as any).role === 'rider') {
          navigate('/rider');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to sign in',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@local.com',
        password: adminPassword,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Invalid admin password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRiderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'rider@local.com',
        password: riderPassword,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/rider');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Invalid rider password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">FreshAI</h1>
          </div>
          <div>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="rider">Rider</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Username or Email</Label>
                  <Input
                    id="signin-email"
                    type="text"
                    placeholder="admin or email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in as Admin...
                    </>
                  ) : (
                    'Admin Login'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="rider">
              <form onSubmit={handleRiderLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rider-password">Rider Password</Label>
                  <Input
                    id="rider-password"
                    type="password"
                    placeholder="Enter rider password"
                    value={riderPassword}
                    onChange={(e) => setRiderPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in as Rider...
                    </>
                  ) : (
                    'Rider Login'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
