
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Linkedin } from 'lucide-react';

const APP_NAME = "The Wisdom Way";
const APP_DESCRIPTION = "Explore universal spiritual concepts across traditions.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then(registration => {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, err => {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
              `,
            }}
          />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <footer className="py-12 text-center text-sm text-muted-foreground border-t bg-card">
            <div className="container mx-auto px-4">
                <p className="mb-4">Developed by Abhijeet Pathy</p>
                <a href="https://www.linkedin.com/in/abhijeet-pathy-165b75118/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                    Connect on LinkedIn
                </a>
            </div>
          </footer>
        </div>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
