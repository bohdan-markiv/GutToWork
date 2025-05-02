"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "./DropdownMenu"; // Adjust path as needed

const cookingOptions = [
  "raw",
  "boiled",
  "deep fried",
  "pan fried",
  "baked",
  "infused",
];

const CookingTypeDropdown = ({ field }: { field: any }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(field.value || []);

  useEffect(() => {
    field.onChange(selectedTypes);
  }, [selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
          {selectedTypes.length > 0
            ? selectedTypes.join(", ")
            : "Select Cooking Types"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {cookingOptions.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selectedTypes.includes(type)}
            onCheckedChange={() => toggleType(type)}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CookingTypeDropdown;