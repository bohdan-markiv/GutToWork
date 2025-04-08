"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

export default function LookerDashboardPage() {
  const router = useRouter();

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Personal Cabinet</h1>
      <Button
        className="mt-4 hover:!bg-gray-500"
        onClick={() => router.push("/welcome_page")}
      >
        Back
      </Button>
      <iframe
        width="600"
        height="450"
        src="https://lookerstudio.google.com/embed/reporting/5afe7a02-92df-4f88-854b-d8e2a6bdb178/page/oMBqE"
        frameBorder="0"
        style={{ border: 0, width: "100%", height: "80vh" }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        title="Looker Studio Dashboard"
      />
    </div>
  );
}
