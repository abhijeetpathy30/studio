
'use client';

import { BookHeart, Heart, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { ColorThemeToggle } from './ColorThemeToggle';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';

export function Header() {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';
  const heartHref = isAboutPage ? '/' : '/about';
  const { permission, requestPermission, toggleNotifications, notificationsEnabled } = useNotifications();

  const handleReminderClick = () => {
    if (permission === 'default') {
      requestPermission();
    } else {
      toggleNotifications();
    }
  };

  return (
    <header className="py-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold font-headline text-foreground">
          <BookHeart className="h-7 w-7 text-primary" />
          <span>The Wisdom Way</span>
        </Link>
        <div className='flex items-center gap-2'>
           <Button asChild variant="outline" size="icon" aria-label={isAboutPage ? "Back to Home" : "About the App"}>
              <Link href={heartHref}>
                <Heart className="h-5 w-5" />
              </Link>
           </Button>
           {permission !== 'denied' && (
             <Button variant={notificationsEnabled ? "default" : "outline"} size="icon" onClick={handleReminderClick} aria-label="Toggle daily reminders">
                <Bell className="h-5 w-5" />
             </Button>
           )}
          <ColorThemeToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
