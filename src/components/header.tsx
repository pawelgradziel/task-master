'use client';

import { CheckCircle2, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: 'Welcome!',
        description: 'Successfully signed in with Google.',
      });
    } catch (error) {
      toast({
        title: 'Sign In Failed',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Sign Out Failed',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="bg-primary/80 text-primary-foreground shadow-md backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            Task Master
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-8 animate-pulse bg-primary-foreground/20 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback className="text-xs">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">
                    {user.displayName || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={handleSignIn}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
