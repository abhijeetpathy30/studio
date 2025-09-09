import { Header } from '@/components/layout/Header';
import { Linkedin } from 'lucide-react';


export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
       <footer className="py-12 text-center text-sm text-muted-foreground border-t bg-secondary/50">
        <div className="container mx-auto px-4">
            <p className="mb-4">Developed by Abhijeet Pathy</p>
            <a href="https://www.linkedin.com/in/abhijeet-pathy-165b75118/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
                Connect on LinkedIn
            </a>
        </div>
      </footer>
    </div>
  );
}
