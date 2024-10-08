import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Serif } from 'next/font/google'

import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toaster from "@/components/ui/toaster";
import Footer from "@/components/extras/footer";

const roboto = Roboto_Serif({
  subsets: ["latin"],
  weight: ['400', '500', '700', '900']
});

export const metadata: Metadata = {
  title: "Marefiya - Find a Home",
  description: "Marefiya is a platform to find a home to fit your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
        >
          <div className="flex-grow px-6 md:px-12 mx-auto max-w-7xl">
            <Nav />
            {children}
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
