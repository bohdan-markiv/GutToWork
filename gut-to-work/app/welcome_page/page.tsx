"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

export default function MainPage() {
  const router = useRouter();

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white text-blue-600 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-4">Gut to Work</h1>
        <p className="text-lg text-gray-700 mb-10">
          What goes in must come out...
          Understand your gut. Track what you eat, how you feel, and how your body responds — all in one place.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={() => router.push("/choice_table")} className="w-full py-3 text-base font-semibold">
            Get Started
          </Button>
          <Button onClick={() => router.push("/ingredients_table")} className="w-full py-3 text-base font-semibold">
            Ingredients
          </Button>
          <Button onClick={() => router.push("/poop_table")} className="w-full py-3 text-base font-semibold">
            Poop
          </Button>
          <Button onClick={() => router.push("/feelings_table")} className="w-full py-3 text-base font-semibold">
            Feelings
          </Button>
          <Button onClick={() => router.push("/food_table")} className="w-full py-3 text-base font-semibold">
            Food
          </Button>
          <Button onClick={() => router.push("/dashboard")} className="w-full py-3 text-base font-semibold">
            Dashboard
          </Button>
        </div>
=======
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-blue-500"  style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}>
      <h1 className="text-4xl font-bold mb-4">Welcome to Gut to Work</h1>
      <p className="text-lg text-center max-w-2xl">
        This project is designed to help you analyze your diet and find out why
        exactly your mood is not always the best.
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
        <Button
          className="mt-4 hover:!bg-gray-500" // Use hover:!bg-gray-500 if you need to force the override
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </Button>
        <Button
          className="mt-4 hover:!bg-gray-500" // Use hover:!bg-gray-500 if you need to force the override
          onClick={() => router.push("/food_table")}
        >
          Food
        </Button>
>>>>>>> origin/development
      </div>
    </div>
  );
}
