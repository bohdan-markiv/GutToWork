"use client";

import { Button } from "../components/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/Table";
import { useRouter } from "next/navigation";
export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-blue-300">
      <h1 className="text-4xl font-bold mb-4">Welcome to Dashboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        className="mt-4 hover:!bg-gray-500" // Use hover:!bg-gray-500 if you need to force the override
        onClick={() => router.push("/welcome_page")}
      >
        Back
      </Button>
    </div>
  );
}
