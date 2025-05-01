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
import { Ingredient, Ingredients, FoodRecord, FoodRecords  } from "../types";

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
    const [foodRecords, setFoodRecords] = useState<FoodRecords>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records"
        );
        setFoodRecords(response.data);
      } catch (error) {
        console.error("Failed to fetch food records", error);
      }
    };
    fetchData();
  }, []);

  const groupedRecords = foodRecords.reduce((acc, record) => {
    const date = record.record_date;
    const timeOfDay = record.time_of_day;
  
    if (!acc[date]) {
      acc[date] = {};
    }
  
    if (!acc[date][timeOfDay]) {
      acc[date][timeOfDay] = [];
    }
  
    acc[date][timeOfDay].push(record);
  
    return acc;
  }, {});

    return (
        <div 
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}
      >
            <h1 className="text-4xl font-bold mb-4">Food Records</h1>

            {/* ----- Food Table ----- */}
            <div className="w-full max-w-6xl overflow-auto border-2 border-[var(--background)] rounded-lg">
            <Table className="border-collapse">
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Ingredient</TableHead>
      <TableHead>Cooking Type</TableHead>
      <TableHead>Portion Size</TableHead>
      <TableHead className="w-[50px] text-center"></TableHead> {/* Edit/Delete */}
    </TableRow>
  </TableHeader>
<TableBody>
  {Object.entries(groupedRecords)
    .sort(([a], [b]) => new Date(a) - new Date(b)) // Sort by date
    .map(([date, timeGroups]) => (
      Object.entries(timeGroups)
        .sort(([a], [b]) => a.localeCompare(b)) // Optional: sort time of day (e.g., morning, afternoon)
        .map(([timeOfDay, records], timeIndex) =>
          records.map((record, index) => (
            <TableRow key={`${record["foodRecord-id"]}-${index}`}>
              {index === 0 && timeIndex === 0 && (
                <TableCell
                  rowSpan={Object.values(timeGroups).flat().length}
                  className="align-top font-bold"
                >
                  {date}
                </TableCell>
              )}
              {index === 0 && (
                <TableCell
                  rowSpan={records.length}
                  className="align-top font-semibold italic"
                >
                  {timeOfDay}
                </TableCell>
              )}
              <TableCell>{record.ingredient_name}</TableCell>
              <TableCell>{record.cooking_type}</TableCell>
              <TableCell>{record.portion_size}</TableCell>
              <TableCell className="text-center">
                {/* Optional: edit/delete buttons */}
              </TableCell>
            </TableRow>
          ))
        )
    ))}
</TableBody>
</Table>
</div>
        </div>
    );
}