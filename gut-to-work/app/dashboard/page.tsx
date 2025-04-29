"use client";
import { useEffect, useState } from "react";
import type { NextPage } from "next";

type EmbedResponse = {
  EmbedUrl?: string;
  embedUrl?: string;
  [key: string]: any;
};

const apiEndpoint =
  "https://jho15yk7y9.execute-api.eu-central-1.amazonaws.com/default/dashboard_trigger"; // e.g. "https://xyz.execute-api.eu-central-1.amazonaws.com/prod/embed"

const EmbeddedDashboard: NextPage = () => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiEndpoint)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as EmbedResponse;
      })
      .then((data) => {
        // some APIs return { EmbedUrl } others { embedUrl }
        const url = data.EmbedUrl ?? data.embedUrl;
        if (!url) throw new Error("No EmbedUrl in response");
        setEmbedUrl(url);
      })
      .catch((e: Error) => {
        console.error("Embed fetch error", e);
        setError(e.message);
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <h2>Failed to load dashboard</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading dashboard…</h2>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", margin: 0 }}>
      <iframe
        title="QuickSight Embedded Dashboard"
        src={embedUrl}
        width="100%"
        height="100%"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts"
        style={{ border: 0 }}
      />
    </div>
  );
};

export default EmbeddedDashboard;
