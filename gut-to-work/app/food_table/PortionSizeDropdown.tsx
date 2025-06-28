import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/DropdownMenu';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

const sizeOptions = ["small", "normal", "big"];

type PortionSizeDropdownProps<T extends FieldValues, K extends Path<T>> = {
  field: ControllerRenderProps<T, K>;
  defaultValue: string;
};

const PortionSizeDropdown = <T extends FieldValues, K extends Path<T>>({
  field,
  defaultValue,
}: PortionSizeDropdownProps<T, K>) => {
  const [selectedType, setSelectedType] = useState<string>(defaultValue || "");

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
