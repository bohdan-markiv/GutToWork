"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Home } from "lucide-react";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../components/Table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/Form";
import { Input } from "../components/Input";
import IngredientDropdown from "./IngredientDropdown";
import CookingTypeDropdown from "./CookingTypeDropdown";
import PortionSizeDropdown from "./PortionSizeDropdown";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogDescription,
} from "../components/AlertDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";

import { FoodRecord, FoodRecordIngredient, Ingredient } from "../types";

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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [foodRecords, setFoodRecords] = useState<FoodRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FoodRecord | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [recordToDelete, setRecordToDelete] = useState<FoodRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter()
  

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
    setSuccessMessage("Record successfully deleted!");
    setErrorMessage(null);

    // Reset the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  } catch (err) {
    console.error("Failed to delete record", err);
    setSuccessMessage(null);
    setErrorMessage("Failed to delete the record. Please try again.");  // Set the error message

    setTimeout(() => {
      setErrorMessage(null); // Hide the error message after 3 seconds
    }, 3000);
  }
};

const onEditSubmit = async (data: FormData) => {
  if (editingRecord) {
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

    const updatedRecord = {
      ...response.data,
      record_date: response.data.record_date || data.date,
      time_of_day: response.data.time_of_day || data.time_of_day,
      ingredients: payload.ingredients, // make sure this is an array, not JSON string
    };

    setFoodRecords((prev) =>
      prev.map((record) =>
        record["food-record-id"] === editingRecord["food-record-id"]
          ? updatedRecord
          : record
      )
    );

    // Set success message on successful update
    setSuccessMessage("Food record updated successfully!");
    setErrorMessage(null); // Clear any previous error messages

    // Reset the form and close the modal/dialog
    form.reset();
    setEditingRecord(null);
    setOpen(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  } catch (error) {
    console.error("Failed to update food record", error);

    // Set error message if the update fails
    setErrorMessage("Failed to update the food record. Please try again.");
    setSuccessMessage(null); // Clear any previous success messages

    // Hide error message after 3 seconds
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }
}};


  useEffect(() => {
    const fetchFoodRecords = async () => {
      try {
        const response = await axios.get(
          "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/food_records"
        );
        const formattedRecords = response.data.map((record: FoodRecord) => ({
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

  useEffect(() => {
    if (editingRecord) {
      setOpen(true);
    }
  }, [editingRecord]);

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

    // Set success message on successful creation
    setSuccessMessage("Food record created successfully!");
    setErrorMessage(null); // Clear any previous error messages

    // Reset the form and close the modal/dialog
    form.reset();
    setOpen(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  } catch (error) {
    console.error("Failed to create food record", error);

    // Set error message if the creation fails
    setErrorMessage("Failed to create the food record. Please try again.");
    setSuccessMessage(null); // Clear any previous success messages

    // Hide error message after 3 seconds
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8" style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}>
      <h1 className="text-4xl font-bold mb-4">Food Records</h1>

            {/* ----- Display Success Message ----- */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-500 text-white rounded-lg shadow-md">
          <strong>{successMessage}</strong>
        </div>
      )}


      <div className="w-full max-w-6xl mb-4 flex justify-between">
  <Button
    onClick={() => {
      router.push("/welcome_page");
    }}
    className="hover:!bg-gray-500"
  >
    <Home className="w-4 h-4" />
  </Button>

    <div className="absolute left-1/2 transform -translate-x-1/2">
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
</div>

{/* Table with sticky header */}
<div className="w-full max-w-6xl border-2 border-[var(--background)] rounded-lg">
  <div className="max-h-[400px] overflow-y-auto relative">
    <Table className="border-collapse w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px] sticky top-0 z-20 bg-[var(--background)]">
            Date
          </TableHead>
          <TableHead className="w-[150px] sticky top-0 z-20 bg-[var(--background)]">
            Time of Day
          </TableHead>
          <TableHead className="w-[150px] sticky top-0 z-20 bg-[var(--background)]">
            Ingredients
          </TableHead>
          <TableHead className="w-[150px] sticky top-0 z-20 bg-[var(--background)]">
          </TableHead>
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
                form.setValue("ingredients", record.ingredients.map((i: FoodRecordIngredient) => i.ingredient_id));
                record.ingredients.forEach((ing: FoodRecordIngredient) => {
                  form.setValue(`ingredients_info.${ing.ingredient_id}.cookingType`, ing.cooking_type);
                  form.setValue(`ingredients_info.${ing.ingredient_id}.portionSize`, ing.portion_size);
                });
                setMode("edit");
              }}
            >
              <TableCell>{record.record_date}</TableCell>
              <TableCell>{record.time_of_day}</TableCell>
              <TableCell>
                <ul className="list-disc pl-4">
                  {record.ingredients?.map((ing: FoodRecordIngredient, idx: number) => (
                    <li key={idx}>
                      {ing.ingredient_name} ({ing.cooking_type || "N/A"} {ing.portion_size || "N/A"})
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                {errorMessage && (
        <div className="text-red-600 text-sm font-medium mb-2">
          {errorMessage}
        </div>
      )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecordToDelete(record);
                  }}
                  className="hover:bg-gray-500 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
                            <DropdownMenuItem key={type} onSelect={() => field.onChange(type)}>
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
                name="ingredients"
                render={() => (
                  <FormItem>
                    <FormLabel>Select Ingredients</FormLabel>
                    <FormControl>
                      <IngredientDropdown
  control={form.control}
  name="ingredients"
  ingredients={ingredients}
  onAddIngredient={(id) => {
    const ingredient = ingredients.find((i) => i["ingredients-id"] === id);
    if (ingredient) {
      form.setValue(`ingredients_info.${id}.cookingType`, ingredient.default_cooking_type || "");
      form.setValue(`ingredients_info.${id}.portionSize`, ingredient.default_portion_size || "");
    }
  }}
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
      <FormControl>
        <CookingTypeDropdown
          field={field}
          defaultValue={ingredient?.default_cooking_type || ""}
        />
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
                          <FormLabel>Portion Size</FormLabel>
                          <FormControl>
                            <PortionSizeDropdown 
                            field={field}
                            defaultValue={ingredient?.default_portion_size || ""} /></FormControl>
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

      <AlertDialog open={!!recordToDelete} onOpenChange={(open) => {
  if (!open) setRecordToDelete(null);
}}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete this food record.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setRecordToDelete(null)}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={async () => {
          if (recordToDelete) {
            await handleDelete(recordToDelete["food-record-id"]);
            setRecordToDelete(null);
          }
        }}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>
  );
}
