type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassArray = ClassValue[];
type ClassValue = string | number | null | undefined | false | ClassDictionary | ClassArray;

function flattenClassValue(input: ClassValue): string[] {
  if (!input) return [];

  if (typeof input === "string" || typeof input === "number") {
    return [String(input)];
  }

  if (Array.isArray(input)) {
    return input.flatMap(flattenClassValue);
  }

  return Object.entries(input)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([className]) => className);
}

export function cn(...inputs: ClassValue[]) {
  return inputs.flatMap(flattenClassValue).join(" ");
}
