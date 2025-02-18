"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

export default function dashboardPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-blue-300">
            <h1 className="text-4xl font-bold mb-4">Welcome to Dashboard</h1>
            <p className="text-lg text-center max-w-2xl">
                This project is designed to help you analyze your diet and find out why exactly your mood is not always the best.
            </p>
            <Button
                className="hover:!bg-gray-500"
                onClick={() => router.back()} // This makes the button go back
            >
                Go Back
            </Button>
        </div>
    );
}
