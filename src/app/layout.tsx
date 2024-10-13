import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lingo",
  description:
    "Learning a language on Duolingo is completely free, but you can remove ads and support free education with Super. First 2 weeks on us! Learn more ...",
  icons: {
    icon: "/lex_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning={true}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
