"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table";
import { Ingredient, Ingredients, FoodRecord, FoodRecords } from "../types";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/Form";
import { Input } from "../components/Input";

import IngredientDropdown from "../components/IngredientDropdown";
import CookingTypeDropdown from "../components/CookingTypeDropdown";
import PortionSizeDropdown from "../components/PortionSizeDropdown";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/AlertDialog";

import { groupFoodRecords } from "./functions";

const formSchema = z.object({
  ingredient_name: z.string().nonempty("Ingredient name is required"),
  default_cooking_type: z.string().nonempty("Default cooking type is required"),
  default_size: z.string().nonempty("Default size is required"),
  ingredients: z.array(z.string()),
  portionSizes: z.record(z.string()),
});

type FormData = z.infer<typeof formSchema>;

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<Ingredients>([]);
  const [foodRecords, setFoodRecords] = useState<FoodRecords>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredient_name: "",
      default_cooking_type: "",
      default_size: "",
      ingredients: [],
      portionSizes: [],
    },
  });

  const selectedIngredients = form.watch("ingredients") || [];

  // Fetch ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/ingredients"
        );
        setIngredients(response.data);
      } catch (error) {
        console.error("Failed to fetch ingredients", error);
      }
    };
    fetchIngredients();
  }, []);

  // Fetch food records
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

  // Clear dependent fields when ingredients are deselected
  useEffect(() => {
    const deselectedIngredients = Object.keys(form.getValues("portionSizes")).filter(
      (id) => !selectedIngredients.includes(id)
    );

    // Reset portionSizes for deselected ingredients
    deselectedIngredients.forEach((id) => {
      form.setValue(`portionSizes.${id}`, undefined); // Clear the dependent fields
    });
  }, [selectedIngredients, form]);

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted with data:", data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}>
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
              .map(([date, timeGroups]) =>
                Object.entries(timeGroups)
                  .sort(([a], [b]) => a.localeCompare(b)) // Optional: sort time of day (e.g., morning, afternoon)
                  .map(([timeOfDay, records], timeIndex) =>
                    records.map((record, index) => (
                      <TableRow key={`${record["foodRecord-id"]}-${index}`}>
                        {index === 0 && timeIndex === 0 && (
                          <TableCell rowSpan={Object.values(timeGroups).flat().length} className="align-top font-bold">
                            {date}
                          </TableCell>
                        )}
                        {index === 0 && (
                          <TableCell rowSpan={records.length} className="align-top font-semibold italic">
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
              )}
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

              {selectedIngredients.map((id: string) => {
                const ingredient = ingredients.find((i) => i["ingredients-id"] === id);

                return (
                  <div key={id} className="border p-4 rounded mb-2">
                    <h4 className="font-semibold mb-2">{ingredient ? ingredient.ingredient_name : "Ingredient not found"}</h4>

                    <FormField
                      control={form.control}
                      name={`portionSizes.${id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooking type for {ingredient ? ingredient.ingredient_name : "Unknown Ingredient"}</FormLabel>
                          <FormControl>
                            <CookingTypeDropdown field={field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Portion Size */}
                    <FormField
                      control={form.control}
                      name={`portionSizes.${id}.portionSize`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portion Size</FormLabel>
                          <FormControl>
                            <PortionSizeDropdown field={field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}

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
