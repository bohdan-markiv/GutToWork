"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Trash2 } from "lucide-react";

import { Button } from "../components/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/Table";
import { Ingredient, Ingredients } from "../types";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/Form";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/DropdownMenu";

import { Input } from "../components/Input";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogDescription,
} from "../components/AlertDialog";

import { EditForm } from "../components/EditForm";

export default function DashboardPage() {
    const [ingredients, setIngredients] = useState<Ingredients>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <div 
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}
      >
            <h1 className="text-4xl font-bold mb-4">Food Records</h1>

            {/* ----- Ingredients Table ----- */}
            <div className="w-full max-w-6xl overflow-auto border-2 border-[var(--background)] rounded-lg">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead>Ingredients</TableHead>
                            <TableHead>Time of Day</TableHead>
                            <TableHead className="w-[50px] text-center"></TableHead> {/* Delete */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                            <TableRow 
                            >
                                <TableCell className="font-medium">datet</TableCell>
                                <TableCell>time of day</TableCell>
                                <TableCell>ingredients</TableCell>
                                <TableCell className="text-center">
                                </TableCell>
                            </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}