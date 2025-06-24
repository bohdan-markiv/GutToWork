"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "../components/Card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { Home } from "lucide-react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const ENDPOINT =
  "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/frontend/heatmap?dataset=food&columns=ingredient,cooking_type&agg=avg";

type ApiResponse = {
  dataset: string;
  aggregated_by: [string, string];
  aggregation: string;
  results: { x: string; y: string; value: number | null }[];
};

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(ENDPOINT);
        setData(res.data as ApiResponse);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading …
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        Failed to load chart: {error}
      </div>
    );
  }

  // Data is available here
  const xLabels = Array.from(new Set(data.results.map((r) => r.x)));
  const yLabels = Array.from(new Set(data.results.map((r) => r.y)));

  // Pivot into grouped data for Recharts
  const groupedData = xLabels.map((ingredient) => {
    const row: Record<string, string | number> = { ingredient };
    yLabels.forEach((cookingType) => {
      const match = data.results.find(
        (r) => r.x === ingredient && r.y === cookingType
      );
      row[cookingType] = match?.value ?? 0;
    });
    return row;
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--surface)", color: "var(--primary)" }}
    >
      <div style={{ padding: 20, position: "relative" }}>
        <Button
          onClick={() => router.push("/welcome_page")}
          className="hover:!bg-gray-500"
        >
          <Home className="w-4 h-4" />
        </Button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>

        <motion.div
          className="container mx-auto mt-10 max-w-5xl px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <h2 className="text-2xl font-semibold">
                {data.dataset.toUpperCase()} chart – {data.aggregated_by[0]} ×{" "}
                {data.aggregated_by[1]} ({data.aggregation})
              </h2>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={groupedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ingredient" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {yLabels.map((cookingType) => (
                      <Bar
                        key={cookingType}
                        dataKey={cookingType}
                        name={cookingType}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
