import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; // Import the Header component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Server-side metadata export
export const metadata = {
  title: "Nick's Recipes",
  description: "CMS for recipes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Use the Header component here */}
        <Header />
        <main className="py-10">{children}</main>
      </body>
    </html>
  );
}
