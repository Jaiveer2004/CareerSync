import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { ChatBubble } from "@/components/chat/ChatBubble";

export const metadata: Metadata = {
  title: "CareerSync | Premium Technical Recruitment",
  description: "Advanced ATS and tech recruitment platform connecting engineers with top companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-slate-50 text-slate-900 scroll-smooth">
        <Providers>
          {children}
          <ChatBubble />
        </Providers>
      </body>
    </html>
  );
}
