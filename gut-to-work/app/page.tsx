"use client";

import { useRouter } from "next/navigation";
import { Button } from "./components/Button";

export default function MainPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-4">Welcome to Gut to Work</h1>
      <p className="text-lg text-center max-w-2xl">
        This project is designed to help you analyze your diet and find out why exactly your mood is not always the best.
      </p>
      <div>
        <Button
          className="mt-4 hover:!bg-gray-500" // Use hover:!bg-gray-500 if you need to force the override
          onClick={() => router.push("/choice_table")}
        >
        Get Started
        </Button>
        <Button
          className="mt-4 hover:!bg-gray-500" // Use hover:!bg-gray-500 if you need to force the override
          onClick={() => router.push("/ingredients_table")}
        >
          Ingredients
        </Button>
      </div>
    </div>
  );
}
