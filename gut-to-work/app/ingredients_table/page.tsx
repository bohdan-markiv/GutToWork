"use client";

import { Button } from "../components/Button";
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/Table";
import { useEffect, useState } from "react";

export default function DashboardPage() {

    const [ingredients, setIngredients] = useState<any[]>([]);

    useEffect(() => {
        // Wrap your axios call in an async function
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/ingredients"
                );
                setIngredients(response.data);
            } catch (error) {
                console.error("Failed to fetch ingredients", error);
            }
        };

        fetchData();
        // Don’t forget to call the async function inside the effect
    }, []);

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
                className="hover:!bg-gray-500" // This makes the button go back
            >
                Go Back
            </Button>
        </div>

    );
}
