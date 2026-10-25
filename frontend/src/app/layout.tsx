import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { DemoProvider } from '../context/DemoContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Jayathu Jaya | ජයතු ජය මංගල සේවාව',
  description: 'Sri Lanka’s premier matrimonial and horoscope service for families locally and across the globe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si">
      <body className="antialiased min-h-screen flex flex-col bg-[#FFF8FA] text-[#352A30] selection:bg-[#AD3B65] selection:text-white font-serif">
        <LanguageProvider>
          <AuthProvider>
            <DemoProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </DemoProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
