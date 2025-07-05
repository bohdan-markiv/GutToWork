"use client";

import { useState } from "react";
import { Button } from "./Button";
import { AlertDialogCancel } from "./AlertDialog";
import { Feeling, EditFeelingFormProps } from "../types"; // This tells typeScript: "This component is expecting props (inputs) in the exact structure defined by EditFeelingForm Props"

export function EditFeelingForm({
  feeling,
  onSubmit,
  onCancel,
  successMessage,
  errorMessage,
}: EditFeelingFormProps) {
  const [score, setScore] = useState<number>(feeling.feeling_score);
  const [stress, setStress] = useState<number>(feeling.stress_level);
  const [date, setDate] = useState<string>(feeling.feeling_date);

  const handleSubmit = async () => {
    const updatedFeeling: Feeling = {
      ...feeling,
      feeling_score: score,
      stress_level: stress,
      feeling_date: date,
    };

    try {
      await onSubmit(updatedFeeling);
    } catch (err) {
      console.error("Failed to update feeling:", err);
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

      <div className="mb-4">
        <label className="block font-medium mb-1">Feeling Score (1–10):</label>
        <input
          type="number"
          value={score}
          min={1}
          max={10}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Stress Level (1–10):</label>
        <input
          type="number"
          value={stress}
          min={1}
          max={10}
          onChange={(e) => setStress(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
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
