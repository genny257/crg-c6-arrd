import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Belleza, Alegreya } from 'next/font/google'
import AuthProvider from '@/components/auth-provider';
import { Chatbot } from '@/components/chatbot';

const belleza = Belleza({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-headline',
})

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Comité-6-Arrondissement',
  description: 'Application de la Croix-Rouge Gabonaise pour la gestion des volontaires, missions et dons.',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${alegreya.variable} ${belleza.variable} font-body antialiased`}>
        <AuthProvider>
            {children}
            <Chatbot />
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
