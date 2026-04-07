import type {Metadata} from 'next';
import { Inter, JetBrains_Mono, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://traceenv.dev'),
  title: {
    default: 'Trace Env | Your Terminal Writes the Docs',
    template: '%s | Trace Env',
  },
  description: 'Local-first developer tool that automatically generates reproducible setup documentation by observing terminal workflows.',
  applicationName: 'Trace Env',
  keywords: ['Trace Env', 'developer tooling', 'terminal workflow', 'documentation automation', 'local-first'],
  openGraph: {
    type: 'website',
    title: 'Trace Env | Your Terminal Writes the Docs',
    description: 'Local-first developer tool that automatically generates reproducible setup documentation by observing terminal workflows.',
    siteName: 'Trace Env',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trace Env | Your Terminal Writes the Docs',
    description: 'Local-first developer tool that automatically generates reproducible setup documentation by observing terminal workflows.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("dark", jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body suppressHydrationWarning className="bg-[#0A0A0A] text-zinc-400 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
