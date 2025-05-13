import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./DropdownMenu";
import { Button } from "./Button";
import { AlertDialogCancel } from "./AlertDialog";
import { Ingredient } from "../types";
import { EditFormProps } from "../types";

export function EditForm({ ingredient, onSubmit, onCancel, successMessage, errorMessage }: EditFormProps) {
    const [name, setName] = useState(ingredient.ingredient_name);
    const [cookingType, setCookingType] = useState(ingredient.default_cooking_type);
    const [size, setSize] = useState(ingredient.default_portion_size);

    const handleSubmit = async () => {
        const updatedIngredient: Ingredient = {
            ...ingredient,
            ingredient_name: name,
            default_cooking_type: cookingType,
            default_portion_size: size,
        };
        try {
            await onSubmit(updatedIngredient);
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
                <label>Ingredient Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <label>Default Cooking Type:</label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                            {cookingType || "Select Cooking Type"}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        {["raw", "boiled", "deep fried", "pan fried", "baked", "infused"].map((type) => (
                            <DropdownMenuItem key={type} onSelect={() => setCookingType(type)}>
                                {type}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <label>Default Size:</label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="w-full px-3 py-2 border border-[var(--accent)] rounded-md cursor-pointer bg-background focus:outline-none focus:ring-2 focus:ring-ring shadow-sm">
                            {size || "Select Portion Size"}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        {["small", "normal", "big"].map((sizeOption) => (
                            <DropdownMenuItem key={sizeOption} onSelect={() => setSize(sizeOption)}>
                                {sizeOption}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-4">
                <AlertDialogCancel asChild>
                    <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                </AlertDialogCancel>
                <Button onClick={handleSubmit}>Save</Button>
            </div>
        </div>
    );
}
