import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MusicApp - Your Ultimate Music Experience",
  description:
    "Discover, share, and enjoy music with MusicApp. Join us for an unparalleled music experience.",
  keywords: "music, streaming, songs, playlists, discover music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta
          name="keywords"
          content="music, streaming, songs, playlists, discover music"
        />
      </head>
      <body className={inter.className}>
        <header className="fixed z-10 w-full top-0 bg-gray-800 text-white shadow-lg">
          {/* Use the next/image component for optimized loading */}
          <Image src="/1.webp" alt="logo" width={50} height={50} />
          <div className=" absolute font-extrabold right-1.5 top-1.5">
            alpha
          </div>
        </header>
        <div
          translate="no"
          className="mt-[50px] w-full relative block m-0 p-0 min-h-full dark:bg-black "
        >
          {children}
        </div>
      </body>
    </html>
  );
}
