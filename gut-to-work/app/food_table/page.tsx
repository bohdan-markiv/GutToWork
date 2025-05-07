"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { Button } from "../components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table";
import { Ingredient, Ingredients, FoodRecord, FoodRecords } from "../types";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/Form";
import { Input } from "../components/Input";

import IngredientDropdown from "../components/IngredientDropdown";
import CookingTypeDropdown from "../components/CookingTypeDropdown";
import PortionSizeDropdown from "../components/PortionSizeDropdown";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";

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
  date: z.string({ required_error: "Date is required" }),
  time_of_day: z.string({ required_error: "Time of day is required" }),
  ingredients: z.array(z.string()),
  ingredients_info: z.record(
    z.object({
      cookingType: z.string().nonempty("Cooking type is required"),
      portionSize: z.string().nonempty("Portion size is required"),
    })
  ),
});
type FormData = z.infer<typeof formSchema>;

function groupByDateAndTime(foodRecords: FoodRecords) {
  const grouped: Record<string, Record<string, FoodRecord[]>> = {};

  foodRecords.forEach((record) => {
    const date = record.record_date;
    const time = record.time_of_day;

    if (!grouped[date]) {
      grouped[date] = {};
    }
    if (!grouped[date][time]) {
      grouped[date][time] = [];
    }

    grouped[date][time].push(record);
  });

  return grouped;
}

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [foodRecords, setFoodRecords] = useState<FoodRecords>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      time_of_day: "",
      ingredients: [],
      ingredients_info: {},
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
    const fetchFoodRecords = async () => {
      try {
        const response = await axios.get(
          "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records"
        );
        const formattedRecords = response.data.map((record: any) => {
          const ingredients = JSON.parse(record.ingredients_json);
          return {
            ...record,
            ingredients,
          };
        });
        setFoodRecords(formattedRecords);
      } catch (error) {
        console.error("Failed to fetch food records", error);
      }
    };
    fetchFoodRecords();
  }, []);

  // Clear dependent fields when ingredients are deselected
  useEffect(() => {
    const deselectedIngredients = Object.keys(form.getValues("ingredients_info")).filter(
      (id) => !selectedIngredients.includes(id)
    );

    // Reset ingredients_info for deselected ingredients
    deselectedIngredients.forEach((id) => {
      form.setValue(`ingredients_info.${id}`, { cookingType: "", portionSize: "" });
    });
  }, [selectedIngredients, form]);

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);  // This will log when the form is submitted
  
    try {
      const payload = {
        record_date: data.date,
        time_of_day: data.time_of_day,
        ingredients: data.ingredients.map((ingredientId) => {
          const ingredientInfo = data.ingredients_info[ingredientId];
          const ingredient = ingredients.find((i) => i["ingredients-id"] === ingredientId);
  
          return {
            ingredient_id: ingredientId,
            ingredient_name: ingredient?.ingredient_name || "",
            cooking_type: ingredientInfo?.cookingType || "",
            portion_size: ingredientInfo?.portionSize || "",
          };
        }),
      };
  
      // Log the payload to see if it's being constructed properly
      console.log("Payload:", payload);
  
      // Make the POST request to add the food record
      const response = await axios.post(
        "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records",
        payload
      );
  
      // Log the response to see if it contains the expected data
      console.log("API Response: ", response.data);  // Check if the response is returned
  
      // Continue with your logic if the request is successful
      const newRecord = {
        ...response.data,
        // Don't parse — assume already structured
        ingredients: response.data.ingredients,
      };
      
      setFoodRecords((prev) => [newRecord, ...prev]);
  
      // Reset the form and close the dialog
      form.reset();
setOpen(false);
    } catch (error) {
      console.error("Failed to create food record", error);
    }
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
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[120px]">Time of Day</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Cooking Style</TableHead>
              <TableHead>Portion Size</TableHead>
              <TableHead className="w-[50px] text-center"></TableHead> {/* Delete */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodRecords.length > 0 ? (
              Object.entries(groupByDateAndTime(foodRecords)).map(([date, times]) => {
                const totalDateRows = Object.values(times).reduce(
                  (acc, records) => acc + (records?.reduce((rAcc, r) => rAcc + (r.ingredients?.length || 0), 0) || 0),
                  0
                );

                let hasRenderedDate = false;

                return Object.entries(times).map(([time, records]) => {
                  const timeRowCount = records.reduce((acc, record) => acc + (record.ingredients?.length || 0), 0);
                  let hasRenderedTime = false;

                  return records.flatMap((record) =>
                    record.ingredients?.map((ingredient, index) => (
                      <TableRow key={`${record["food-record-id"]}-${ingredient.ingredient_id}-${index}`}>
                        {!hasRenderedDate && (
                          <TableCell rowSpan={totalDateRows} className="align-top font-semibold">
                            {date}
                          </TableCell>
                        )}
                        {!hasRenderedTime && (
                          <TableCell rowSpan={timeRowCount} className="italic align-top">
                            {time}
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{ingredient.ingredient_name}</TableCell>
                        <TableCell>{ingredient.cooking_type}</TableCell>
                        <TableCell>{ingredient.portion_size}</TableCell>
                        <TableCell className="text-center text-blue-700 underline cursor-pointer">
                          delete
                        </TableCell>
                        {(hasRenderedDate = true)}
                        {(hasRenderedTime = true)}
                      </TableRow>
                    ))
                  );
                });
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No records available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className="mt-4 hover:!bg-gray-500">Create Ingredient</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-h-screen overflow-y-auto">
          <AlertDialogTitle>Create ingredient</AlertDialogTitle>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time_of_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                            {field.value || "Select time of day"}
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuSeparator />
                          {["morning", "afternoon", "evening", "night"].map((type) => (
                            <DropdownMenuItem
                              key={type}
                              onSelect={() => field.onChange(type)}
                            >
                              {type}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ingredient Dropdown */}
              <FormField
                control={form.control}
                name="ingredients"
                render={() => (
                  <FormItem>
                    <FormLabel>Select Ingredients</FormLabel>
                    <FormControl>
                      <IngredientDropdown
                        control={form.control}
                        name="ingredients"
                        ingredients={ingredients}
                        onAddIngredient={(id) => console.log("Ingredient added:", id)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ingredient Info */}
              {form.watch("ingredients")?.map((id: string) => {
                const ingredient = ingredients.find((i) => i["ingredients-id"] === id);
                return (
                  <div key={id} className="border p-4 rounded mb-2">
                    <h4 className="font-semibold mb-2">
                      {ingredient ? ingredient.ingredient_name : "Ingredient not found"}
                    </h4>
                    <FormField
                      control={form.control}
                      name={`ingredients_info.${id}.cookingType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooking type for {ingredient?.ingredient_name}</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                                  {field.value || "Select Cooking Type"}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuSeparator />
                                {[
                                  "raw",
                                  "boiled",
                                  "deep fried",
                                  "pan fried",
                                  "baked",
                                  "infused",
                                ].map((type) => (
                                  <DropdownMenuItem
                                    key={type}
                                    onSelect={() => field.onChange(type)}
                                  >
                                    {type}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ingredients_info.${id}.portionSize`}
render={({ field }) => (
<FormItem>
<FormLabel>Portion size for {ingredient?.ingredient_name}</FormLabel>
<FormControl>
<PortionSizeDropdown field={field}/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
</div>
);
})}

          {/* Submit Button */}
          <AlertDialogFooter>
          <Button type="submit">Submit</Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </AlertDialogContent>
  </AlertDialog>
</div>
  );
}
