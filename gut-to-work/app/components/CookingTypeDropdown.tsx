import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
  // Initialize state to the field value (if available) or the default placeholder value
  const [selectedType, setSelectedType] = useState<string>(field.value || "");

  // Sync selectedType when field.value changes, to ensure correct default value
  useEffect(() => {
    if (field.value !== selectedType) {
      setSelectedType(field.value || ""); // Update state with field.value when it changes
    }
  }, [field.value]); // Runs whenever field.value changes

  const handleSelection = (type: string) => {
    // Set the selected type when clicking a new option
    setSelectedType(type);
    field.onChange(type); // Update the form field value
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
          {selectedType || "Select Cooking Type"} {/* If selectedType is empty, show placeholder */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {cookingOptions.map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => handleSelection(type)}
            className={selectedType === type ? "bg-blue-100" : ""} // Highlight selected option
          >
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CookingTypeDropdown;

