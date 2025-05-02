"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./DropdownMenu"; // Adjust path as needed

const portionSizes = [
  "small",
  "normal",
  "big",
];

const PortionSizeDropdown = ({ field }: { field: any }) => {
  const [selectedType, setSelectedType] = useState<string>(field.value || "");

  useEffect(() => {
    field.onChange(selectedType); // Update form value when selection changes
  }, [selectedType]);

  const handleSelection = (type: string) => {
    // Only set the selected type when clicking a new one
    setSelectedType(type);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
          {selectedType ? selectedType : "Select Portion Size"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {portionSizes.map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => handleSelection(type)}
            className={selectedType === type ? "bg-blue-100" : ""}
          >
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PortionSizeDropdown;