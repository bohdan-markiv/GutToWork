"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Trash2 } from "lucide-react";
import { Home } from "lucide-react";


import { Slider } from "../components/Slider";
<Slider defaultValue={[33]} max={100} step={1} />

import { Button } from "../components/Button";
import { // This can be seen in ui.shadcn.com as seen in this link https://ui.shadcn.com/docs/components/table
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/Table";
import { Feeling } from "../types";  // Defined in Types.ts

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

import { EditFeelingForm } from "../components/EditFeelingForm";



// ----- Zod Schema for Feeling Form ----- 
const formSchema = z.object({
    feeling_score: z
      .number({ invalid_type_error: "Feeling score must be a number" })
      .min(1, "Feeling score must be at least 1")
      .max(10, "Feeling score must be at most 10"),
  
    stress_level: z
      .number({ invalid_type_error: "Stress level must be a number" })
      .min(1, "Stress level must be at least 1")
      .max(10, "Stress level must be at most 10"),
  
    feeling_date: z
      .string()
      .nonempty("Date is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
  });
  
  type FormData = z.infer<typeof formSchema>; 



  export default function FeelingsPage() { // Creating a page component. This defines the things that are on the Page. Prepares all things you need to store ing, select ingredients, open/close modals and show success error messages inside the page.
    const router = useRouter();
    const [feelings, setFeelings] = useState<Feeling[]>([]);
    const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ----- Fetch Feelings ----- 
    useEffect(() => {  // This is how we do the connection to AWS (the backend) 
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/feelings" // Take data from the table ingredients
                );
                setFeelings(response.data);
            } catch (error) {
                console.error("Failed to fetch feelings", error);
            }
        };
        fetchData();
    }, []);

   
    //You are creating a form instance using React Hook Form.
    const form = useForm<FormData>({ //"This form will use the type FormData" This helps TypeScript know exactly what fields the form expects.
        resolver: zodResolver(formSchema),
        defaultValues: {
            feeling_score: undefined,
            stress_level: undefined, //undefined means the number fields will be empty by default (useful for sliders or number inputs).
            feeling_date: "",
        },
    });

    //This will run when the user submits the "Create Feeling" form. It sends a POST request to your API and updates the table.

    // ----- Handle Form Submission -----
    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post(
                "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/feelings",
                {
                    feeling_score: data.feeling_score,
                    stress_level: data.stress_level,
                    feeling_date: data.feeling_date,
                } // (based on what the user typed in the form — data comes from the form.)
            );
  
            const newFeeling: Feeling = {
                feeling_score: data.feeling_score,
                stress_level: data.stress_level,
                feeling_date: data.feeling_date,
                "feeling-id": response.data,
            };
  
            setFeelings((prev) => [...prev, newFeeling]);
            form.reset(); // Clear form
            setOpen(false); // Close dialog
            setSuccessMessage("Feeling successfully created!");
            setErrorMessage(null);
            setTimeout(() => {
                setSuccessMessage(null); // Hide the message after 3 seconds
            }, 3000);
        } catch (error) {
            console.error("Failed to create feeling", error);
            setErrorMessage("Failed to create feeling. Please try again.");
            setSuccessMessage(null);
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
    }
  };
  

    // ----- Handle Feeling Deletion -----
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(
                `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/feelings/${id}` 
            );
            //This button part is here cause If not it wouldnt update in our visual only in aws. 
            setFeelings((prev) =>
                prev.filter((item) => item["feeling-id"] !== id)
            );
  
            setSuccessMessage("Feeling successfully deleted!");
            setErrorMessage(null);
  
            setTimeout(() => setSuccessMessage(null), 3000);
          } catch (error) {
            console.error("Failed to delete feeling", error);
            setErrorMessage("Failed to delete feeling. Please try again.");
            setSuccessMessage(null);
  
            setTimeout(() => setErrorMessage(null), 3000);
    }
  };
  

    // ----- Handle Feeling Edit -----
    const handleEditSubmit = async (updatedFeeling: Feeling) => {
        try {
        await axios.put(
            `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/feelings/${updatedFeeling["feeling-id"]}`,
            updatedFeeling
        );
    
        setFeelings((prev) =>
            prev.map((item) =>
            item["feeling-id"] === updatedFeeling["feeling-id"]
                ? updatedFeeling
                : item
            )
        );
    
        setSuccessMessage("Feeling updated successfully!");
        setErrorMessage(null);
    
        setTimeout(() => setSuccessMessage(null), 3000);
        setSelectedFeeling(null); // Close the dialog
        } catch (error) {
        console.error("Failed to update feeling", error);
        setErrorMessage("Failed to update feeling. Please try again.");
        setSuccessMessage(null);
    
        setTimeout(() => setErrorMessage(null), 3000);
        }
    };
    


/////////////////// RETURN STATEMENT GIVES VISUAL COMPONENT OF THE PAGE, The UI /////////////


return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: "white", color: "var(--primary)" }}
    >
      <h1 className="text-4xl font-bold mb-4">Feelings</h1>



            {/* ----- Display Success Message ----- */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-500 text-white rounded-lg shadow-md"> 
                    {/* Defined outisde to be Table to put it on top*/}
                    <strong>{successMessage}</strong>
                </div>
            )}

            {/* Centered Create Button */}
            <div className="mb-4 flex justify-center">
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                <Button className="hover:!bg-gray-500">Create Feeling</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogTitle>Create Feeling</AlertDialogTitle>

                    {errorMessage && (
                    <div className="text-red-600 text-sm font-medium mb-2">{errorMessage}</div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Feeling Score */}
                            <FormField
                            control={form.control}
                            name="feeling_score"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Feeling Score (1–10)</FormLabel>
                                <FormControl>
                                    <Slider
                                    defaultValue={[field.value ?? 5]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(val: number[]) => field.onChange(val[0])}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />


                            {/* Stress Level */}
                            <FormField
                            control={form.control}
                            name="stress_level"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Stress Level (1–10)</FormLabel>
                                <FormControl>
                                    <Slider
                                    defaultValue={[field.value ?? 5]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(val: number[]) => field.onChange(val[0])}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />


                            {/* Date */}
                            <FormField
                            control={form.control}
                            name="feeling_date"
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

                            {/* Buttons */}
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

 
            {/* ----- Feelings Table with Home Button ----- */}
            <div className="relative w-full max-w-4xl">

            {/* Home Button - positioned above top-left corner of the table */}
            <div className="absolute -top-12 left-0">
                <Button
                onClick={() => router.push("/welcome_page")}
                className="p-3 bg-sky-500 hover:bg-sky-600 rounded-xl shadow"
                >
                <Home className="w-5 h-5 text-white" />
                </Button>
            </div>

            {/* Actual table container */}
            <div className="overflow-auto border-2 border-[var(--background)] rounded-lg">
                <Table className="border-collapse">
                <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Feeling Score</TableHead>
                            <TableHead className="text-center">Stress Level</TableHead>
                            <TableHead className="w-[50px] text-center"></TableHead> {/* Delete button */}
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {feelings.map((feeling) => (
                   
                            <TableRow
                                key={feeling["feeling-id"]}
                                onClick={() => setSelectedFeeling(feeling)}
                                className="cursor-pointer"
                            >
                                <TableCell>{feeling.feeling_date}</TableCell>
                                <TableCell className="text-center">{feeling.feeling_score}</TableCell>
                                <TableCell className="text-center">{feeling.stress_level}</TableCell>
                                <TableCell className="text-center">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                onClick={(e) => e.stopPropagation()}
                                                className="mt-2 hover:bg-gray-500 inline-flex items-center justify-center gap-2 p-2">
                                                    
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                {errorMessage && (
                                                    <div className="text-red-600 text-sm font-medium mb-2">{errorMessage}</div>)}
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the selected feeling.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(feeling["feeling-id"])}>Delete</AlertDialogAction>
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
                  


            {/* Create Edit Form - When a row is clicked, selectedFeeling gets set - This shows a modal (AlertDialog) with your EditFeelingForm inside it*/}
            {selectedFeeling && (
                <AlertDialog open={!!selectedFeeling} onOpenChange={() => setSelectedFeeling(null)}>
                    <AlertDialogContent className="max-w-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Feeling</AlertDialogTitle>
                        </AlertDialogHeader>
                        <EditFeelingForm
                            feeling={selectedFeeling}
                            onSubmit={handleEditSubmit}
                            onCancel={() => setSelectedFeeling(null)} // Close the dialog
                            successMessage={successMessage}
                            errorMessage={errorMessage}
                        />
                    </AlertDialogContent>
                </AlertDialog>
            )}




    </div>
  );
}