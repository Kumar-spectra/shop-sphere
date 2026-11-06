import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { LearningModeBanner } from '@/components/layout/LearningModeBanner';
import { Navbar } from '@/components/layout/Navbar';
import { SecondaryNavbar } from '@/components/layout/SecondaryNavbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ShopSphere: Online Shopping India - Best Deals & Fast Delivery',
  description:
    'ShopSphere - Online shopping for electronics, smartphones, computers, apparel, books, home appliances and more with fast delivery and secure payments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F5F6F7]">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LearningModeBanner />
              <Navbar />
              <SecondaryNavbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

