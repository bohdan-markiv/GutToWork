"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";




import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/Table";

import { Poop } from "../types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/Form";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Slider } from "../components/Slider";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";

import { Trash2 } from "lucide-react";

const formSchema = z.object({
  score: z.coerce.number().int().min(1).max(10),
  poop_date: z.string().nonempty("Poop date is required"),
  time_of_day: z.string().nonempty("Time of day is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function DashboardPage() {
    const router = useRouter();
  const [poop, setPoop] = useState<Poop[]>([]);
  const [selectedPoop, setSelectedPoop] = useState<Poop | null>(null);
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/poop"
        );
        setPoop(response.data);
      } catch (error) {
        console.error("Failed to fetch poop records", error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score: 5,
      poop_date: "",
      time_of_day: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(
        "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/poop",
        data
      );
      const newPoop: Poop = {
        ...data,
        "poop-id": response.data,
      };
      setPoop((prev) => [...prev, newPoop]);
      form.reset();
      setOpen(false);
      setSuccessMessage("Poop record successfully created!");
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to create poop record", error);
      setErrorMessage("Failed to create poop record. Please try again.");
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/poop/${id}`
      );
      setPoop((prev) => prev.filter((item) => item["poop-id"] !== id));
      setSuccessMessage("Poop record successfully deleted!");
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to delete poop record", error);
      setErrorMessage("Failed to delete poop record. Please try again.");
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleEditSubmit = async (updatedPoop: Poop) => {
    try {
      await axios.put(
        `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/poop/${updatedPoop["poop-id"]}`,
        updatedPoop
      );
      setPoop((prev) =>
        prev.map((item) =>
          item["poop-id"] === updatedPoop["poop-id"] ? updatedPoop : item
        )
      );
      setSuccessMessage("Poop record updated successfully!");
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      setSelectedPoop(null);
    } catch (error) {
      console.error("Failed to update poop record", error);
      setErrorMessage("Failed to update poop record. Please try again.");
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  function EditForm({
    poop,
    onSubmit,
    onCancel,
    successMessage,
    errorMessage,
  }: {
    poop: Poop;
    onSubmit: (updatedPoop: Poop) => void;
    onCancel: () => void;
    successMessage: string | null;
    errorMessage: string | null;
  }) {
    const [poopDate, setPoopDate] = useState(poop.poop_date);
    const [timeOfDay, setTimeOfDay] = useState(poop.time_of_day);
    const [score, setScore] = useState(poop.score);

    const handleSubmit = async () => {
      const updatedPoop = {
        ...poop,
        poop_date: poopDate,
        time_of_day: timeOfDay,
        score: score,
      };
      try {
        await onSubmit(updatedPoop);
      } catch (err) {
        console.error("Update failed:", err);
      }
    };

    return (
      <div>
        {successMessage && (
          <div className="mb-3 p-2 rounded-md bg-green-100 text-green-700 border border-green-300 text-sm font-medium">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-3 p-2 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm font-medium">
            {errorMessage}
          </div>
        )}
        <div>
          <label>Date:</label>
          <Input
            type="date"
            value={poopDate}
            onChange={(e) => setPoopDate(e.target.value)}
          />
        </div>
        <div>
          <label>Time of Day:</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                {timeOfDay || "Select Time of Day"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              {["morning", "afternoon", "evening", "night"].map((type) => (
                <DropdownMenuItem
                  key={type}
                  onSelect={() => setTimeOfDay(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <label>Score:</label>
          <Slider
            defaultValue={[score]}
            min={1}
            max={10}
            step={1}
            onValueChange={(val: number[]) => setScore(val[0])}
          />
        </div>
        <div className="flex items-center justify-end space-x-4 mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: "white", color: "var(--primary)" }}
    >
        <h1 className="text-4xl font-bold mb-4">Poop</h1>

        <div className="w-full max-w-6xl mb-4 flex justify-center relative">
        {/* Home button on the left */}
        <div className="absolute left-0">
            <Button
            onClick={() => {
                router.push("/welcome_page");
            }}
            className="hover:!bg-gray-500"
            >
            <Home className="w-4 h-4" />
            </Button>
        </div>

        {/* Create Poop Record dialog */}
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
            <Button
                onClick={() => {
                form.reset();
                setSelectedPoop(null);
                setOpen(true);
                }}
                className="hover:!bg-gray-500"
            >
                Create Poop Record
            </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
            {errorMessage && (
                <div className="text-red-600 text-sm font-medium mb-2">
                {errorMessage}
                </div>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="poop_date"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Poop Date</FormLabel>
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
                        <FormLabel>Time of Day</FormLabel>
                        <FormControl>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                                {field.value || "Select Time of Day"}
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
                <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Score</FormLabel>
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


      {successMessage && (
        <div className="mb-4 p-4 bg-green-500 text-white rounded-lg shadow-md">
          <strong>{successMessage}</strong>
        </div>
      )}

        <div className="w-full max-w-6xl border-2 border-[var(--background)] rounded-lg">
        <div className="max-h-[400px] overflow-y-auto">
            <Table className="border-collapse w-full">
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px] sticky top-0 z-10 bg-[var(--background)]">Date</TableHead>
                <TableHead className="sticky top-0 z-10 bg-[var(--background)]">Time of Day</TableHead>
                <TableHead className="sticky top-0 z-10 bg-[var(--background)]">Score</TableHead>
                <TableHead className="w-[50px] text-center sticky top-0 z-10 bg-[var(--background)]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...poop]
                .sort(
                    (a, b) => new Date(b.poop_date).getTime() - new Date(a.poop_date).getTime()
                )
                .map((item) => (
                    <TableRow
                    key={item["poop-id"]}
                    onClick={() => setSelectedPoop(item)}
                    className="cursor-pointer"
                    >
                    <TableCell className="font-medium">{item.poop_date}</TableCell>
                    <TableCell>{item.time_of_day}</TableCell>
                    <TableCell>{item.score}</TableCell>
                    <TableCell className="text-center">
                        <div onClick={(e) => e.stopPropagation()}>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button
                                onClick={(e) => e.stopPropagation()}
                                className="mt-4 hover:bg-gray-500 inline-flex items-center justify-center gap-2 p-2"
                            >
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
                                delete this poop record.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                onClick={() => handleDelete(item["poop-id"])}
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


      {selectedPoop && (
        <AlertDialog
          open={!!selectedPoop}
          onOpenChange={() => setSelectedPoop(null)}
        >
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Poop Record</AlertDialogTitle>
            </AlertDialogHeader>
            <EditForm
              poop={selectedPoop}
              onSubmit={handleEditSubmit}
              onCancel={() => setSelectedPoop(null)}
              successMessage={successMessage}
              errorMessage={errorMessage}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
