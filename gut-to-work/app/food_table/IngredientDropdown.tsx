// IngredientDropdown.tsx
import { Controller } from "react-hook-form";
import { Ingredient } from "../types";
import { useState } from "react";

interface IngredientDropdownProps {
  control: any;
  name: string;
  label?: string;
  ingredients: Ingredient[];
  onAddIngredient?: (id: string) => void;
}

const IngredientDropdown = ({
  control,
  name,
  label,
  ingredients,
  onAddIngredient,
}: IngredientDropdownProps) => {
  const [inputValue, setInputValue] = useState("");

  const getIngredientById = (id: string) =>
    ingredients.find((ing) => ing["ingredients-id"] === id);

  const getIngredientByName = (name: string) =>
    ingredients.find(
      (ing) => ing.ingredient_name.toLowerCase() === name.toLowerCase()
    );

  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedIds: string[] = field.value || [];

          const addIngredient = (name: string) => {
            const match = getIngredientByName(name);
            if (match && !selectedIds.includes(match["ingredients-id"])) {
              field.onChange([...selectedIds, match["ingredients-id"]]);
              onAddIngredient?.(match["ingredients-id"]);
            }
            setInputValue("");
          };

          const removeIngredient = (id: string) => {
            field.onChange(selectedIds.filter((item) => item !== id));
          };

          const suggestions = ingredients.filter(
            (ing) =>
              (!inputValue ||
                ing.ingredient_name
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())) &&
              !selectedIds.includes(ing["ingredients-id"])
          );

          return (
            <div className="border border-[var(--accent)] rounded-md p-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedIds.map((id) => {
                  const ingredient = getIngredientById(id);
                  return (
                    <span
                      key={id}
                      className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center"
                    >
                      {ingredient?.ingredient_name}
                      <button
                        type="button"
                        onClick={() => removeIngredient(id)}
                        className="ml-1 text-xs text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
              <input
                className="w-full border-none outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient(inputValue.trim());
                  }
                }}
                placeholder="Type to add ingredients..."
              />
              {suggestions.length > 0 && (
                <div className="mt-1 border border-gray-300 rounded shadow-sm bg-white max-h-40 overflow-y-auto">
                  {suggestions.map((sug) => (
                    <div
                      key={sug["ingredients-id"]}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => addIngredient(sug.ingredient_name)}
                    >
                      {sug.ingredient_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default IngredientDropdown;
