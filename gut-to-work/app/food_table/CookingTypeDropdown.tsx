import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/DropdownMenu"; // Adjust path as needed

const cookingOptions = [
  "raw",
  "boiled",
  "deep fried",
  "pan fried",
  "baked",
  "infused",
];

interface CookingTypeDropdownProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  defaultValue: string;
}

const CookingTypeDropdown = ({
  field,
  defaultValue,
}: CookingTypeDropdownProps) => {
  const [selectedType, setSelectedType] = useState<string>(field.value || defaultValue || "");

  useEffect(() => {
    if (field.value !== selectedType) {
      setSelectedType(field.value || defaultValue || "");
    }
  }, [field.value, defaultValue]);

  const handleSelection = (type: string) => {
    setSelectedType(type);
    field.onChange(type);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
          {selectedType || "Select Cooking Type"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {cookingOptions.map((type) => (
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

export default CookingTypeDropdown;