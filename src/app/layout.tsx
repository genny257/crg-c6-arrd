import type {Metadata, Viewport} from 'next';
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

const APP_NAME = "CRG - Comité 6e Arr.";
const APP_DEFAULT_TITLE = "Croix-Rouge Gabonaise | Comité du 6ème Arrondissement";
const APP_TITLE_TEMPLATE = "%s | CRG 6e Arr.";
const APP_DESCRIPTION = "Plateforme de la Croix-Rouge Gabonaise (Comité du 6ème Arrondissement) pour la gestion des volontaires, missions et dons. Ensemble nous sommes plus forts.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: new URL('https://croixrouge-gabon.com'), // Replace with your actual domain
    images: [
      {
        url: '/logo.png', // Replace with a specific OG image URL
        width: 1200,
        height: 630,
        alt: 'Logo de la Croix-Rouge Gabonaise',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ['/logo.png'], // Replace with a specific Twitter card image URL
  },
  keywords: ["Croix-Rouge", "Gabon", "humanitaire", "don", "volontariat", "secourisme", "missions", "Libreville", "Comité 6e Arrondissement"],
  authors: [{ name: "TechGA", url: "https://your-website.com" }], // Replace with your website
  creator: "TechGA",
  publisher: "TechGA",
};

export const viewport: Viewport = {
  themeColor: "#B71C1C",
  initialScale: 1,
  width: 'device-width',
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
