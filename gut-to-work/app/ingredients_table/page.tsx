"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";      

import { Trash2, Home } from "lucide-react";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/Form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

// ----- Zod Schema for Ingredient Form -----
const formSchema = z.object({
  ingredient_name: z.string().nonempty("Ingredient name is required"),
  default_cooking_type: z.string().nonempty("Default cooking type is required"),
  default_size: z.string().nonempty("Default size is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<Ingredients>([]);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // ----- Fetch Ingredients -----
  useEffect(() => {
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
  }, []);

  // ----- React Hook Form Setup for Creating Ingredient -----
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredient_name: "",
      default_cooking_type: "",
      default_size: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        ingredient_name: "",
        default_cooking_type: "",
        default_size: "",
      });
    }
  }, [open, form]);

  // ----- Handle Form Submission -----
  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(
        "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/ingredients",
        {
          ingredient_name: data.ingredient_name,
          default_cooking_type: data.default_cooking_type,
          default_portion_size: data.default_size,
        }
      );
      const newIngredient: Ingredient = {
        ingredient_name: data.ingredient_name,
        default_cooking_type: data.default_cooking_type,
        "ingredients-id": response.data,
        default_portion_size: data.default_size,
      };
      setIngredients((prev) => [...prev, newIngredient]);
      form.reset(); // Clear the form
      setOpen(false); // Close the dialog
      setSuccessMessage("Ingredient successfully created!");
      setErrorMessage(null); // Set the success message
      setTimeout(() => {
        setSuccessMessage(null); // Hide the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Failed to create ingredient", error);
      setErrorMessage("Failed to create ingredient. Please try again."); // Set the error message
      setSuccessMessage(null);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // ----- Handle Ingredient Deletion -----
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/ingredients/${id}`
      );
      setIngredients((prev) =>
        prev.filter((item) => item["ingredients-id"] !== id)
      );
      setSuccessMessage("Ingredient successfully deleted!");
      setErrorMessage(null); // Set the success message
      setTimeout(() => {
        setSuccessMessage(null); // Hide the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Failed to delete ingredient", error);
      setErrorMessage("Failed to delete ingredient. Please try again."); // Set the error message
      setSuccessMessage(null);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // ----- Handle Ingredient Edit -----

  const handleEditSubmit = async (updatedIngredient: Ingredient) => {
    try {
      await axios.put(
        `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/ingredients/${updatedIngredient["ingredients-id"]}`,
        updatedIngredient
      );
      setIngredients((prev) =>
        prev.map((item) =>
          item["ingredients-id"] === updatedIngredient["ingredients-id"]
            ? updatedIngredient
            : item
        )
      );
      setSuccessMessage("Ingredient updated successfully!");
      setErrorMessage(null); // Reset error message on success
      setTimeout(() => {
        setSuccessMessage(null); // Hide the success message after 3 seconds
      }, 3000);
      setSelectedIngredient(null); // Close the dialog
    } catch (error) {
      console.error("Failed to update ingredient", error);
      setErrorMessage("Failed to update ingredient. Please try again.");
      setSuccessMessage(null); // Reset success message on error
      setTimeout(() => {
        setErrorMessage(null); // Hide the error message after 3 seconds
      }, 3000);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}
    >
      <h1 className="text-4xl font-bold mb-4">Ingredients</h1>

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
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger asChild>
      <Button className="hover:!bg-gray-500">Create Ingredient</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogTitle>Create ingredient</AlertDialogTitle>
      {errorMessage && (
        <div className="text-red-600 text-sm font-medium mb-2">
          {errorMessage}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Ingredient Name */}
          <FormField
            control={form.control}
            name="ingredient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredient Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Potato" {...field} />
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
                <FormLabel>Default Cooking Type</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                        {field.value || "Select Cooking Type"}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuSeparator />
                      {["raw", "boiled", "deep fried", "pan fried", "baked", "infused"].map((type) => (
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

          {/* Default Size */}
          <FormField
            control={form.control}
            name="default_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Size</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                        {field.value || "Select Portion Size"}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuSeparator />
                      {["small", "normal", "big"].map((type) => (
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

          <div className="flex items-center justify-end space-x-4">
            <AlertDialogCancel asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </AlertDialogContent>
  </AlertDialog>
</div>
</div>

      {/* ----- Display Success Message ----- */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-500 text-white rounded-lg shadow-md">
          <strong>{successMessage}</strong>
        </div>
      )}

      {/* ----- Ingredients Table ----- */}
      <div className="w-full max-w-6xl overflow-auto border-2 border-[var(--background)] rounded-lg">
        <div className="relative max-h-[400px] overflow-y-auto">
        <Table className="border-collapse">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Default Cooking style</TableHead>
              <TableHead>Default Size</TableHead>
              <TableHead className="w-[50px] text-center"></TableHead>{" "}
              {/* Delete */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow
                key={ingredient["ingredients-id"]}
                onClick={() => setSelectedIngredient(ingredient)} // Trigger edit on row click
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {ingredient.ingredient_name}
                </TableCell>
                <TableCell>{ingredient.default_cooking_type}</TableCell>
                <TableCell>{ingredient.default_portion_size}</TableCell>
                <TableCell className="text-center">
                  <div onClick={(e) => e.stopPropagation()}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 hover:bg-gray-500 inline-flex items-center justify-center gap-2 p-2"
                        >
                          {/* Trash icon inside the button */}
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        {errorMessage && (
                          <div className="text-red-600 text-sm font-medium mb-2">
                            {errorMessage}
                          </div>
                        )}
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. It will permanently
                            delete this ingredient.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDelete(ingredient["ingredients-id"])
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>

      {selectedIngredient && (
        <AlertDialog
          open={!!selectedIngredient}
          onOpenChange={() => setSelectedIngredient(null)}
        >
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Ingredient</AlertDialogTitle>
            </AlertDialogHeader>
            <EditForm
              ingredient={selectedIngredient}
              onSubmit={handleEditSubmit}
              onCancel={() => setSelectedIngredient(null)} // Close the dialog
              successMessage={successMessage}
              errorMessage={errorMessage}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}

      
    </div>
  );
}
