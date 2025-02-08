import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <Link href={`/`} passHref>
              <h1 className="text-2xl font-semibold">Casadei Recipes</h1>
            </Link>
            {/* You can add a logo or a navigation here */}
          </div>
        </header>
        <main className="py-10">{children}</main>
      </body>
    </html>
  );
}
