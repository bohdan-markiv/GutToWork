"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Replace the current route with /choice_table
    router.replace("/welcome_page");
  }, [router]);

  return null;
}
