import { CategoryId } from "../common/types";

export const exportRules = (rules: Record<CategoryId, string[]>) => {
  const jsonString = JSON.stringify(rules, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "category_rules.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importRules = async (files: FileList): Promise<Record<CategoryId, string[]>> => {
  const newRules: Record<CategoryId, string[]> = Object.values(CategoryId).reduce(
    (acc, category) => {
      acc[category as CategoryId] = [];
      return acc;
    },
    {} as Record<CategoryId, string[]>,
  );
  for (const file of files) {
    const jsonString = await file.text();
    const providedRules = JSON.parse(jsonString);
    Object.entries(providedRules).forEach(([category, rules]) => {
      if (Object.values(CategoryId).includes(category as CategoryId)) {
        newRules[category as CategoryId] = rules as string[];
      } else {
        console.warn(`Category ${category} not found in CategoryId enum`);
      }
    });
  }
  return newRules;
};
