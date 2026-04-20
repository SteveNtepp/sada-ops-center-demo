import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { ThemeProvider } from '@/lib/themeContext';

export const metadata: Metadata = {
  title: 'SADA Ops Center',
  description: 'Plateforme opérationnelle intelligente pour PMEs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
