import { AppSidebar } from "@/components/app-sidebar";
import LayoutPremium from "@/components/navbar/DashboardLayout";
import { SidebarProvider, SidebarInset,  } from "@/components/ui/sidebar";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PredictGuard",
  description: "Sua empresa de favorita",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <LayoutPremium>
          
        {children}
          </LayoutPremium>    

      </body>
    </html>
  );
}
