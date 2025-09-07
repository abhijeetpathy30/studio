import { BookHeart } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="py-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold font-headline text-foreground">
          <BookHeart className="h-7 w-7 text-primary" />
          <span>Rational Religion</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
