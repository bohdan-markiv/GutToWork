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

export type Feeling = {
  "feeling-id": string;
  feeling_date: string; // ISO date string, e.g. "2025-04-22"
  feeling_score: number; // expected range: 1–10
  stress_level: number;  // expected range: 1–10
};

export type Feelings = Feeling[]; // optional list type, similar to Ingredients

// Props for the edit form for feelings
export type EditFeelingFormProps = {
  feeling: Feeling;
  onSubmit: (updatedFeeling: Feeling) => void;
  onCancel: () => void;
  successMessage: string | null;
  errorMessage: string | null;
};

export type FoodRecordIngredient = { 
  ingredient_id: string;
  ingredient_name: string;
  portion_size: string;
  cooking_type: string;
}
export type FoodRecord = {
  time_of_day: string; 
  record_date: string; 
  "food-record-id": string;
  ingredients:  FoodRecordIngredient[];
};

export type FoodRecords = FoodRecord[];

export type GroupedFoodRecords = {
  [record_date: string]: {
    [time_of_day: string]: FoodRecord[];
  };
};