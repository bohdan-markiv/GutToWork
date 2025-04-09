// Exporting
export type Ingredient = {
  ingredient_name: string;
  default_cooking_type: string;
  "ingredients-id": string; //why is this in quotation marks?
  default_portion_size: string;
};

export type Ingredients = Ingredient[]; // or Array<Ingredient>

export type Poop = {
  "poop-id": string;
  score: number;
  time_of_day: string;
  poop_date: string;
};

