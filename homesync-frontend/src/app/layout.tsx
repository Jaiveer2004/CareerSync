import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css';

export const metadata: Metadata = {
  title: "Fixora - Home Services Platform",
  description: "Book trusted home service professionals for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
         <Toaster position="top-center" />
         <main>{children}</main>
      </body>
    </html>
  );
}
