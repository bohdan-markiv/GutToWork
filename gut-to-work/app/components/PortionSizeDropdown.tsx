import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form'; // Import useFormContext for form control
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './DropdownMenu'; // Assuming these are correct imports

const sizeOptions = ["small", "normal", "big"];

const PortionSizeDropdown = ({
  field,
  defaultValue,
}: {
  field: any;  // Field from React Hook Form
  defaultValue: string;
}) => {
  const [selectedType, setSelectedType] = useState<string>(defaultValue || ""); 

  // Sync internal state with field value from React Hook Form
  useEffect(() => {
    // Only update internal state if the field value changes
    if (field.value !== selectedType) {
      setSelectedType(field.value || defaultValue || "");
    }
  }, [field.value, defaultValue]);

  const handleSelection = (type: string) => {
    setSelectedType(type);
    field.onChange(type); // Update React Hook Form state manually
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
          {selectedType || "Select Portion Size"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {sizeOptions.map((type) => (
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

