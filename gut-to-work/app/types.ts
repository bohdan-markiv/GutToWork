// Exporting
export type Ingredient = {
  ingredient_name: string;
  default_cooking_type: string;
  "ingredients-id": string;
  default_portion_size: string;
};

export type Ingredients = Ingredient[];

export type EditFormProps = {
  ingredient: Ingredient;
  onSubmit: (updatedIngredient: Ingredient) => void;
  onCancel: () => void;
  successMessage: string | null;
  errorMessage: string | null;
};
export type FoodRecordIngredient = {
  ingredient_id: string;
  ingredient_name: string;
  portion_size: string;
  cooking_type: string;
};
export type FoodRecord = {
  time_of_day: string;
  record_date: string;
  "food-record-id": string;
  ingredients: FoodRecordIngredient[];
};

export type FoodRecords = FoodRecord[];

export type GroupedFoodRecords = {
  [record_date: string]: {
    [time_of_day: string]: FoodRecord[];
  };
};
