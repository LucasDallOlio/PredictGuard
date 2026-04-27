"use client";
import PremiumLayout from "@/components/navbar/DashboardLayout";
import { useAuth } from "@/hooks/UseAuth.js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) {
      router.push("/"); 
    }
  }, [usuario, carregando]);

  if (carregando || !usuario) return null;

  return <>
  <PremiumLayout>    
  {children}
  </PremiumLayout>
  </>;
}