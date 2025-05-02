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
    DropdownMenuCheckboxItem,
} from "../components/DropdownMenu";

import CookingTypeDropdown from "../components/CookingTypeDropdown";
import IngredientDropdown from "../components/IngredientDropdown";

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

import { groupFoodRecords } from "./functions"; 

const formSchema = z.object({
  ingredient_name: z.string().nonempty("Ingredient name is required"),
  default_cooking_type: z.string().nonempty("Default cooking type is required"),
  default_size: z.string().nonempty("Default size is required"),
  
});

type FormData = z.infer<typeof formSchema>;

export default function DashboardPage() {
    const [ingredients, setIngredients] = useState<Ingredients>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [open, setOpen] = useState(false);
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

  const groupedRecords = groupFoodRecords(foodRecords);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredient_name: "",
      default_cooking_type: "",
      default_size: "",
      ingredients: [],
    },
  });

// make sure form is clear when opened
  useEffect(() => {
    if (open) {
      form.reset({
        ingredient_name: "",
        default_cooking_type: "",
        default_size: "",
        ingredients: [],
      });
    }
  }, [open, form]);

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted with data:", data);
  };

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

<AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className="mt-4 hover:!bg-gray-500">Create Ingredient</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Create ingredient</AlertDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Ingredient Name */}
              <FormField
  control={form.control}
  name="ingredients"
  render={() => (
    <FormItem>
      <FormLabel>Select Ingredients</FormLabel>
      <FormControl>
        <IngredientDropdown control={form.control} name="ingredients" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

              {/* Cooking Type */}
              <FormField
                control={form.control}
                name="default_cooking_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>cooking type </FormLabel>
                    <FormControl>
                      <CookingTypeDropdown field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end space-x-4">
                <AlertDialogCancel asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

        </div>
    );
  }