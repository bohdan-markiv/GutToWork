"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../components/Table";
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
  AlertDialogAction,
  AlertDialogDescription,
} from "../components/AlertDialog";

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

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [foodRecords, setFoodRecords] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      time_of_day: "",
      ingredients: [],
      ingredients_info: {},
    },
  });

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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records/${id}`
      );
      setFoodRecords((prev) => prev.filter((record) => record["food-record-id"] !== id));
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  const onEditSubmit = async (data: FormData) => {
    try {
      const payload = {
        food_record_id: editingRecord["food-record-id"],
        record_date: data.date,
        time_of_day: data.time_of_day,
        ingredients: data.ingredients.map((ingredientId) => {
          const info = data.ingredients_info[ingredientId];
          const ingredient = ingredients.find((i) => i["ingredients-id"] === ingredientId);
          return {
            ingredient_id: ingredientId,
            ingredient_name: ingredient?.ingredient_name || "",
            cooking_type: info?.cookingType || "",
            portion_size: info?.portionSize || "",
          };
        }),
      };

      const response = await axios.put(
        `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records/${editingRecord["food-record-id"]}`,
        payload
      );

      setFoodRecords((prev) =>
        prev.map((record) =>
          record["food-record-id"] === editingRecord["food-record-id"]
            ? { ...record, ...response.data }
            : record
        )
      );

      form.reset();
      setEditingRecord(null);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update food record", error);
    }
  };

  useEffect(() => {
    const fetchFoodRecords = async () => {
      try {
        const response = await axios.get(
          "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records"
        );
        const formattedRecords = response.data.map((record: any) => ({
          ...record,
          ingredients: JSON.parse(record.ingredients_json),
        }));
        setFoodRecords(formattedRecords);
      } catch (error) {
        console.error("Failed to fetch food records", error);
      }
    };
    fetchFoodRecords();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        record_date: data.date,
        time_of_day: data.time_of_day,
        ingredients: data.ingredients.map((ingredientId) => {
          const info = data.ingredients_info[ingredientId];
          const ingredient = ingredients.find((i) => i["ingredients-id"] === ingredientId);
          return {
            ingredient_id: ingredientId,
            ingredient_name: ingredient?.ingredient_name || "",
            cooking_type: info?.cookingType || "",
            portion_size: info?.portionSize || "",
          };
        }),
      };

      const response = await axios.post(
        "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records",
        payload
      );

      const newRecord = {
        ...response.data,
        record_date: response.data.record_date || data.date,
        time_of_day: response.data.time_of_day || data.time_of_day,
        ingredients: payload.ingredients,
      };
      setFoodRecords((prev) => [newRecord, ...prev]);

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create food record", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8" style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}>
      <h1 className="text-4xl font-bold mb-4">Food Records</h1>

      {/* Create Button at Top */}
      <div className="mb-4">
        <Button
          onClick={() => {
            form.reset();
            setEditingRecord(null);
            setMode("create");
            setOpen(true);
          }}
          className="hover:!bg-gray-500"
        >
          Create New Record
        </Button>
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl overflow-auto border-2 border-[var(--background)] rounded-lg">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[150px]">Time of Day</TableHead>
              <TableHead className="w-[300px]">Ingredients</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...foodRecords]
              .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
              .map((record) => (
                <TableRow
                  key={record["food-record-id"]}
                  onClick={() => {
                    setEditingRecord(record);
                    form.setValue("date", record.record_date);
                    form.setValue("time_of_day", record.time_of_day);
                    form.setValue("ingredients", record.ingredients.map((i: any) => i.ingredient_id));
                    record.ingredients.forEach((ing: any) => {
                      form.setValue(`ingredients_info.${ing.ingredient_id}.cookingType`, ing.cooking_type);
                      form.setValue(`ingredients_info.${ing.ingredient_id}.portionSize`, ing.portion_size);
                    });
                    setMode("edit");
                    setOpen(true);
                  }}
                >
                  <TableCell>{record.record_date}</TableCell>
                  <TableCell>{record.time_of_day}</TableCell>
                  <TableCell>
                    <ul className="list-disc pl-4">
                      {record.ingredients?.map((ing: any, idx: number) => (
                        <li key={idx}>
                          {ing.ingredient_name} ({ing.cooking_type || "N/A"} {ing.portion_size || "N/A"})
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          onClick={(e) => e.stopPropagation()}
                          className="hover:bg-gray-500 inline-flex items-center justify-center gap-2 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this food record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(record["food-record-id"])}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            {foodRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No records available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Modal */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-h-screen overflow-y-auto">
          <AlertDialogTitle>{mode === "edit" ? "Edit Record" : "Create New Record"}</AlertDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(mode === "edit" ? onEditSubmit : onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time_of_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Day</FormLabel>
                    <FormControl><Input {...field} placeholder="Enter time of day" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        onAddIngredient={(id) => console.log("Added:", id)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("ingredients")?.map((id: string) => {
                const ingredient = ingredients.find((i) => i["ingredients-id"] === id);
                return (
                  <div key={id} className="border p-4 rounded mb-2">
                    <h4 className="font-semibold mb-2">
                      {ingredient ? ingredient.ingredient_name : "Unknown Ingredient"}
                    </h4>
                    <FormField
                      control={form.control}
                      name={`ingredients_info.${id}.cookingType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooking Type</FormLabel>
                          <FormControl><CookingTypeDropdown field={field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients_info.${id}.portionSize`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portion Size</FormLabel>
                          <FormControl><PortionSizeDropdown field={field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
              <AlertDialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{mode === "edit" ? "Update" : "Submit"}</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
