"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Trash2, Home } from "lucide-react";

import { Slider } from "../components/Slider";
import { Button } from "../components/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/Table";

import { Feeling } from "../types";

import {
  Form,
  FormControl,
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogDescription,
} from "../components/AlertDialog";

const formSchema = z.object({
  feeling_score: z
    .number({ invalid_type_error: "Feeling score must be a number" })
    .min(1)
    .max(10),
  stress_level: z
    .number({ invalid_type_error: "Stress level must be a number" })
    .min(1)
    .max(10),
  feeling_date: z
    .string()
    .nonempty("Date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function FeelingsPage() {
  const router = useRouter();
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/feelings"
        );
        setFeelings(response.data);
      } catch (error) {
        console.error("Failed to fetch feelings", error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feeling_score: 5,
      stress_level: 5,
      feeling_date: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(
        "https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/feelings",
        data
      );
      const newFeeling: Feeling = {
        ...data,
        "feeling-id": response.data,
      };
      setFeelings((prev) => [...prev, newFeeling]);
      form.reset();
      setOpen(false);
      setSuccessMessage("Feeling successfully created!");
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to create feeling", error);
      setErrorMessage("Failed to create feeling. Please try again.");
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://mrmevidrmf.execute-api.eu-central-1.amazonaws.com/prod/feelings/${id}`
      );
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
      setSelectedFeeling(null);
    } catch (error) {
      console.error("Failed to update feeling", error);
      setErrorMessage("Failed to update feeling. Please try again.");
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  function EditForm({
    feeling,
    onSubmit,
    onCancel,
    successMessage,
    errorMessage,
  }: {
    feeling: Feeling;
    onSubmit: (updatedFeeling: Feeling) => void;
    onCancel: () => void;
    successMessage: string | null;
    errorMessage: string | null;
  }) {
    const [feelingDate, setFeelingDate] = useState(feeling.feeling_date);
    const [feelingScore, setFeelingScore] = useState(feeling.feeling_score);
    const [stressLevel, setStressLevel] = useState(feeling.stress_level);

    const handleSubmit = async () => {
      const updatedFeeling = {
        ...feeling,
        feeling_date: feelingDate,
        feeling_score: feelingScore,
        stress_level: stressLevel,
      };
      try {
        await onSubmit(updatedFeeling);
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
            value={feelingDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setFeelingDate(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <label>Feeling Score:</label>
          <Slider
            defaultValue={[feelingScore]}
            min={1}
            max={10}
            step={1}
            onValueChange={(val: number[]) => setFeelingScore(val[0])}
          />
        </div>
        <div className="mt-2">
          <label>Stress Level:</label>
          <Slider
            defaultValue={[stressLevel]}
            min={1}
            max={10}
            step={1}
            onValueChange={(val: number[]) => setStressLevel(val[0])}
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
      <h1 className="text-4xl font-bold mb-4">Feelings</h1>

      <div className="w-full max-w-6xl mb-4 flex justify-center relative">
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

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              onClick={() => {
                form.reset();
                setSelectedFeeling(null);
                setOpen(true);
              }}
              className="hover:!bg-gray-500"
            >
              Create Feeling
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            {errorMessage && (
              <div className="text-red-600 text-sm font-medium mb-2">
                {errorMessage}
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="feeling_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeling Date</FormLabel>
                      <FormControl>
                        <input
                          type="date"
                          {...field}
                          max={new Date().toISOString().split("T")[0]}
                          ref={(el) => {
                            field.ref(el);
                            if (el) {
                              el.addEventListener("focus", () => {
                                // @ts-ignore
                                el.showPicker?.();
                              });
                            }
                          }}
                          className="w-full px-3 py-2 border rounded-md cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feeling_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeling Score</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value ?? 5]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(val: number[]) =>
                            field.onChange(val[0])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stress_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stress Level</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value ?? 5]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(val: number[]) =>
                            field.onChange(val[0])
                          }
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
                <TableHead className="sticky top-0 z-10 bg-[var(--background)]">
                  Date
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-[var(--background)] text-center">
                  Feeling Score
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-[var(--background)] text-center">
                  Stress Level
                </TableHead>
                <TableHead className="w-[50px] text-center sticky top-0 z-10 bg-[var(--background)]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...feelings]
                .sort(
                  (a, b) =>
                    new Date(b.feeling_date).getTime() -
                    new Date(a.feeling_date).getTime()
                )
                .map((feeling) => (
                  <TableRow
                    key={feeling["feeling-id"]}
                    onClick={() => setSelectedFeeling(feeling)}
                    className="cursor-pointer"
                  >
                    <TableCell>{feeling.feeling_date}</TableCell>
                    <TableCell className="text-center">
                      {feeling.feeling_score}
                    </TableCell>
                    <TableCell className="text-center">
                      {feeling.stress_level}
                    </TableCell>
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
                                delete this feeling.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(feeling["feeling-id"])
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

      {selectedFeeling && (
        <AlertDialog
          open={!!selectedFeeling}
          onOpenChange={() => setSelectedFeeling(null)}
        >
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Feeling</AlertDialogTitle>
            </AlertDialogHeader>
            <EditForm
              feeling={selectedFeeling}
              onSubmit={handleEditSubmit}
              onCancel={() => setSelectedFeeling(null)}
              successMessage={successMessage}
              errorMessage={errorMessage}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
