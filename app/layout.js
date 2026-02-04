import { Inter, Open_Sans } from "next/font/google"; // Import standard + dyslexic-friendly font
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

// 1. Load the "Professional" Font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 2. Load the "Dyslexic" Font
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-opensans" }); 
// (Note: In a real app, you'd download a specific dyslexic font file, but OpenSans is a good accessible placeholder)

export const metadata = {
  title: "Sahayak Neo",
  description: "Your Digital Sarathi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${openSans.variable} font-sans`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}