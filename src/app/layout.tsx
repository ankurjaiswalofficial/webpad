import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SplashScreen } from "@/components/SplashScreen";

const inter = Inter({
  subsets: ["latin"],
})
export const metadata: Metadata = {
  title: "A Web Notepad",
  description: "A on the go notepad directly accessible from the web browser and is highly accessible",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SplashScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
