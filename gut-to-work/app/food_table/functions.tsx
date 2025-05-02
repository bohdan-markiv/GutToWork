import type { FoodRecord } from "../types";// Adjust the path as needed

export function groupFoodRecords(foodRecords: FoodRecord[]) {
  return foodRecords.reduce((acc, record) => {
    const { record_date: date, time_of_day: timeOfDay } = record;

    if (!acc[date]) {
      acc[date] = {};
    }

    if (!acc[date][timeOfDay]) {
      acc[date][timeOfDay] = [];
    }

    acc[date][timeOfDay].push(record);

    return acc;
  }, {} as Record<string, Record<string, FoodRecord[]>>);
}
