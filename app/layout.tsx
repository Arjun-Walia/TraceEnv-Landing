import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://traceenv.dev'),
  title: {
    default: 'Trace Env — Your Terminal Writes the Docs',
    template: '%s | Trace Env',
  },
  description:
    'Local-first developer tool that automatically generates reproducible setup documentation by observing your terminal workflow.',
  applicationName: 'Trace Env',
  keywords: ['Trace Env', 'developer tooling', 'terminal', 'documentation', 'local-first', 'llm'],
  openGraph: {
    type: 'website',
    title: 'Trace Env — Your Terminal Writes the Docs',
    description: 'Local-first developer tool that automatically generates reproducible setup documentation.',
    siteName: 'Trace Env',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trace Env — Your Terminal Writes the Docs',
    description: 'Local-first developer tool that automatically generates reproducible setup documentation.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
