"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../components/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/Table";
import { Ingredient } from "../types";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/Form";

import { Input } from "../components/Input";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogCancel,
} from "../components/AlertDialog";

// ----- Zod Schema -----
const formSchema = z.object({
    ingredient_name: z.string().nonempty("Ingredient name is required"),
    default_cooking_type: z.string().nonempty("Default cooking type is required"),
    default_size: z.string().nonempty("Default size is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function DashboardPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [open, setOpen] = useState(false);

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

    // ----- React Hook Form Setup -----
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ingredient_name: "",
            default_cooking_type: "",
            default_size: "",
        },
    });

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
            console.log(newIngredient);
            setIngredients((prev) => [...prev, newIngredient]);
            form.reset(); // clear the form
            setOpen(false); // close the dialog
        } catch (error) {
            console.error("Failed to create ingredient", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-blue-300">
            <h1 className="text-4xl font-bold mb-4">Welcome to Dashboard</h1>

            {/* ----- Ingredients Table ----- */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Default Cooking style</TableHead>
                        <TableHead>Default Size</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ingredients.map((ingredient) => (
                        <TableRow key={ingredient["ingredients-id"]}>
                            <TableCell className="font-medium">
                                {ingredient.ingredient_name}
                            </TableCell>
                            <TableCell>{ingredient.default_cooking_type}</TableCell>
                            <TableCell>{ingredient.default_portion_size}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* ----- AlertDialog with Form ----- */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="mt-4 hover:!bg-gray-500">Create Ingredient</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
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
                                        <FormDescription>
                                            Enter the name of the ingredient.
                                        </FormDescription>
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
                                            <Input placeholder="e.g., Boiled" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the usual cooking method.
                                        </FormDescription>
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
                                            <Input placeholder="e.g., Small" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the default portion size.
                                        </FormDescription>
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
    );
}
