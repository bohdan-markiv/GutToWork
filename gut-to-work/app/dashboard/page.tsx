// File: app/embedded-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

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
    <iframe
      title="QuickSight Embedded Dashboard"
      src={embedUrl!}
      width="100%"
      height="100vh"
      allowFullScreen
      sandbox="allow-same-origin allow-scripts"
      style={{ border: 0 }}
    />
  );
}
