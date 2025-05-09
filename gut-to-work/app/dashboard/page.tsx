"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { Home } from "lucide-react";
const API_ENDPOINT =
  "https://jho15yk7y9.execute-api.eu-central-1.amazonaws.com/default/dashboard_trigger";

type EmbedResponse = {
  embedUrl?: string;
  error?: string;
};

export default function EmbeddedDashboard() {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEmbedUrl() {
      try {
        const res = await fetch(API_ENDPOINT, {
          method: "GET",
          mode: "cors",
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const data: EmbedResponse = await res.json();
        if (data.error) throw new Error(data.error);
        if (!data.embedUrl) throw new Error("No embedUrl returned");
        setEmbedUrl(data.embedUrl);
      } catch (err: any) {
        console.error("Embed fetch error", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEmbedUrl();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <h2>Failed to load dashboard</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, position: "relative" }}>
      {/* Go Back button in top-left */}
      <Button
        onClick={() => {
          router.push("/welcome_page");
        }}
        className="hover:!bg-gray-500"
      >
        <Home className="w-4 h-4" />
      </Button>

      {/* Centered Dashboard title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </div>

      {/* Embedded QuickSight Dashboard */}
      <iframe
        title="QuickSight Embedded Dashboard"
        src={embedUrl!}
        width="100%"
        height="1000vh"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts"
        style={{ border: 0 }}
      />
    </div>
  );
}
