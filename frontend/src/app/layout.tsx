import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { DemoProvider } from '../context/DemoContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Sri Kalyana Matrimony | ශ්‍රී කල්‍යාණ මංගල සේවාව',
  description: 'Sri Lanka’s premier matrimonial and horoscope service for families locally and across the globe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#FBF8F5] text-[#30262B] selection:bg-primary-700 selection:text-white font-serif">
        <LanguageProvider>
          <DemoProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </DemoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
