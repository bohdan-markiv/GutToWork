// Exporting
export type Ingredient = {
  ingredient_name: string;
  default_cooking_type: string;
  "ingredients-id": string;
  default_portion_size: string;
};

export type Ingredients = Ingredient[]; 


export type Poop = {
  "poop-id": string;
  score: number;
  time_of_day: string;
  poop_date: string;

export type EditFormProps = {
    ingredient: Ingredient;
    onSubmit: (updatedIngredient: Ingredient) => void;
    onCancel: () => void;
    successMessage: string | null;
    errorMessage: string | null;

};

