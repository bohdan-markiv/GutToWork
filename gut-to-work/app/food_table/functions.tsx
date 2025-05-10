import type { FoodRecord, GroupedFoodRecords } from "../types";// Adjust the path as needed

export function groupFoodRecords(foodRecords: FoodRecord[]): GroupedFoodRecords {
  const grouped: GroupedFoodRecords = {};

  foodRecords.forEach((record) => {
    const { record_date, time_of_day } = record;

    if (!grouped[record_date]) grouped[record_date] = {};
    if (!grouped[record_date][time_of_day]) grouped[record_date][time_of_day] = [];

    grouped[record_date][time_of_day].push(record);
  });

  return grouped;
}